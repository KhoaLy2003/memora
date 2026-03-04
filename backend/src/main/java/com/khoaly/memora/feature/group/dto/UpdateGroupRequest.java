package com.khoaly.memora.feature.group.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateGroupRequest {
    private String name;
    private String description;
    private String avatarUrl;
}
