package com.khoaly.memora.feature.group.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    private String name;
    private String description;
    private Long storageLimitBytes; // Optional, can default in service
}
