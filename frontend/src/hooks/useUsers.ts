import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useUsers = (role?: string) => {
  return useQuery({
    queryKey: ['users', role],
    queryFn: async () => {
      const response = await authService.getAllUsers(role);
      return response.data;
    },
  });
};
