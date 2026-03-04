package com.khoaly.memora.feature.sharing.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.feature.sharing.dto.SharingLinkResponse;
import com.khoaly.memora.feature.sharing.service.SharingLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/albums/{albumId}/share")
@RequiredArgsConstructor
public class SharingLinkController {

    private final SharingLinkService sharingLinkService;

    @PostMapping
    public ApiResponse<SharingLinkResponse> createLink(
            @PathVariable String albumId,
            @RequestParam(required = false) Integer expiresAfterDays,
            @RequestParam(defaultValue = "false") boolean allowUpload) {
        return ApiResponse.success(sharingLinkService.createLink(albumId, expiresAfterDays, allowUpload));
    }
}
