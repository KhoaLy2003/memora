package com.khoaly.memora.feature.sharing.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class SharingLinkResponse {
    private String token;
    private String albumId;
    private LocalDateTime expiresAt;
    private boolean allowUpload;
    private String shareUrl;
}
