import { useMutation } from '@tanstack/react-query';
import { StorageApi } from './storage.api';

export function useCreateUpload() {
  return useMutation({
    mutationFn: StorageApi.createUpload,
  });
}
