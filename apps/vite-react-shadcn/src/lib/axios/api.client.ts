import { EnvConfig } from '@/config/env.config';
import type { RefreshApiResponse } from '@/features/auth';
import authStore from '@/stores/auth.store';
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

class ApiClient {
  private client: AxiosInstance;

  private isRefreshing = false;
  private queue: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: EnvConfig.API_URL,
      withCredentials: true,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private processQueue(token: string) {
    this.queue.forEach((cb) => cb(token));
    this.queue = [];
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = authStore.getState().accessToken;
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.queue.push((token: string) => {
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                };
                resolve(axios(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const response = await axios.post<RefreshApiResponse>(
              `${EnvConfig.API_URL}/auth/refresh`
            );

            const { tokens } = response.data.data;
            authStore.getState().setAccessToken(tokens.access);

            originalRequest.headers.Authorization = `Bearer ${tokens.access}`;

            this.processQueue(tokens.access);
            return this.client(originalRequest);
          } catch (err) {
            this.queue = [];
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
