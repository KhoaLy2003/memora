package com.khoaly.memora.feature.media.dto;

import com.khoaly.memora.feature.media.entity.Media;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
public class MediaResponse {
    private String id;
    private String fileName;
    private Media.MediaType fileType;
    private Long sizeBytes;
    private Map<String, Object> metadata;
    private String albumId;
    private String uploaderId;
    private String downloadUrl; // Presigned URL from MinIO
    private LocalDateTime uploadedAt;
}
