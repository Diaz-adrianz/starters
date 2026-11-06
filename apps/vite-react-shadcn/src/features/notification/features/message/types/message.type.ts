export type Message = {
  id: string;
  userId: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  readAt?: Date | null;
  payload?: Record<string, unknown> | null;
  createdAt: Date;
};
