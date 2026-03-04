import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import type { Group, ApiResponse } from "@/types";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchWithAuth<ApiResponse<Group[]>>("/groups"),
  });
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => fetchWithAuth<ApiResponse<Group>>(`/groups/${groupId}`),
    enabled: !!groupId,
  });
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () =>
      fetchWithAuth<ApiResponse<any[]>>(`/groups/${groupId}/members`),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      fetchWithAuth<ApiResponse<Group>>("/groups", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode: string) =>
      fetchWithAuth<ApiResponse<Group>>(
        `/groups/join?inviteCode=${inviteCode}`,
        {
          method: "POST",
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Group>) =>
      fetchWithAuth<ApiResponse<Group>>(`/groups/${groupId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      fetchWithAuth<ApiResponse<void>>(`/groups/${groupId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      fetchWithAuth<ApiResponse<void>>(`/groups/${groupId}/leave`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      fetchWithAuth<ApiResponse<void>>(
        `/groups/${groupId}/members/${memberId}`,
        {
          method: "DELETE",
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "members"],
      });
    },
  });
}
