package com.khoaly.memora.feature.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private String avatarUrl;
}
