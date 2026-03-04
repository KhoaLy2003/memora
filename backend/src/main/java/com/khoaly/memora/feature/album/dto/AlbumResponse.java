package com.khoaly.memora.feature.album.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AlbumResponse {
    private String id;
    private String name;
    private String description;
    private String coverMediaUrl;
    private String groupId;
    private LocalDateTime createdAt;
}
