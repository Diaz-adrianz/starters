import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageApi } from './message.api';
import { queryKeys } from './message.query';

export function useMarkReadMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => MessageApi.markRead(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
