package com.khoaly.memora.feature.media.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.feature.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaDetailsController {

    private final MediaService mediaService;

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMedia(@PathVariable String id) {
        mediaService.deleteMedia(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}/download")
    public ApiResponse<String> getDownloadUrl(@PathVariable String id) {
        return ApiResponse.success(mediaService.getDownloadUrl(id));
    }
}
