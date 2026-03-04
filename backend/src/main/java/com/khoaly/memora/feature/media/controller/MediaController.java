package com.khoaly.memora.feature.media.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.common.util.SecurityUtils;
import com.khoaly.memora.feature.media.dto.MediaResponse;
import com.khoaly.memora.feature.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/albums/{albumId}/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final SecurityUtils securityUtils;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<MediaResponse>> uploadBatch(
            @PathVariable String albumId,
            @RequestParam("files") MultipartFile[] files) throws IOException {

        String userId = securityUtils.getCurrentUserId();

        List<MediaResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            responses.add(mediaService.uploadMedia(albumId, userId, file));
        }
        return ApiResponse.success(responses);
    }

    @GetMapping
    public ApiResponse<List<MediaResponse>> getMedia(@PathVariable String albumId) {
        return ApiResponse.success(mediaService.getMediaByAlbum(albumId));
    }
}
