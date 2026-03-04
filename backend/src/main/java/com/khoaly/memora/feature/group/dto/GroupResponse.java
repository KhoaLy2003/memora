package com.khoaly.memora.feature.group.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class GroupResponse {
    private String id;
    private String name;
    private String description;
    private Long storageLimitBytes;
    private Long usedStorageBytes;
    private String avatarUrl;
    private String inviteCode;
    private String guestInviteCode;
    private String userRole; // Add the current user's role in this group
    private LocalDateTime createdAt;
}
