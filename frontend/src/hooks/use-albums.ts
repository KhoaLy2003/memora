import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import type { Album, ApiResponse } from "@/types";

export function useAlbums(groupId: string) {
  return useQuery({
    queryKey: ["albums", groupId],
    queryFn: () =>
      fetchWithAuth<ApiResponse<Album[]>>(`/groups/${groupId}/albums`),
    enabled: !!groupId,
  });
}

export function useAlbum(albumId: string) {
  return useQuery({
    queryKey: ["albums", "detail", albumId],
    queryFn: () => fetchWithAuth<ApiResponse<Album>>(`/albums/${albumId}`),
    enabled: !!albumId,
  });
}

export function useCreateAlbum(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      fetchWithAuth<ApiResponse<Album>>(`/groups/${groupId}/albums`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", groupId] });
    },
  });
}

export function useUpdateAlbum(albumId: string, groupId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      description?: string;
      coverMediaUrl?: string;
    }) =>
      fetchWithAuth<ApiResponse<Album>>(`/albums/${albumId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["albums", "detail", albumId],
      });
      if (groupId)
        queryClient.invalidateQueries({ queryKey: ["albums", groupId] });
    },
  });
}

export function useDeleteAlbum(albumId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchWithAuth<ApiResponse<void>>(`/albums/${albumId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", groupId] });
    },
  });
}
