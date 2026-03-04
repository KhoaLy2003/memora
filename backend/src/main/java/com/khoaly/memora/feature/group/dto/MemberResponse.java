package com.khoaly.memora.feature.group.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class MemberResponse {
    private String userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String role;
    private LocalDateTime joinedAt;
}
