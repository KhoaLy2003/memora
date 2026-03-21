import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import type { Media, ApiResponse } from "@/types";

export function useMedia(albumId: string) {
  return useQuery({
    queryKey: ["media", albumId],
    queryFn: () =>
      fetchWithAuth<ApiResponse<Media[]>>(`/albums/${albumId}/media`),
    enabled: !!albumId,
  });
}

export function useUploadMedia(albumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file, file.name);
      });
      return fetchWithAuth<ApiResponse<Media[]>>(
        `/albums/${albumId}/media/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", albumId] });
    },
  });
}
export function useDeleteMedia(albumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) =>
      fetchWithAuth<ApiResponse<void>>(`/media/${mediaId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", albumId] });
    },
  });
}

export function useDownloadMedia() {
  return useMutation({
    mutationFn: async (mediaId: string) => {
      const response = await fetchWithAuth<ApiResponse<string>>(
        `/media/${mediaId}/download`,
      );
      return response.data;
    },
  });
}
