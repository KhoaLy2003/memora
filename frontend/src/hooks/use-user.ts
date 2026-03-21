import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import type { User, ApiResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";

export interface UpdateProfileRequest {
  fullName: string;
  avatarUrl?: string;
}

export function useUser() {
  const queryClient = useQueryClient();
  const updateUserStore = useAuthStore((state) => state.updateUser);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => fetchWithAuth<ApiResponse<User>>("/auth/me"),
    select: (response) => response.data,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (request: UpdateProfileRequest) =>
      fetchWithAuth<ApiResponse<User>>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });

      // Update the global auth store so the navbar avatar and name update instantly
      if (response.data) {
        updateUserStore({
          name: response.data.fullName,
          avatar: response.data.avatarUrl,
        });
      }
    },
  });

  return {
    user,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
