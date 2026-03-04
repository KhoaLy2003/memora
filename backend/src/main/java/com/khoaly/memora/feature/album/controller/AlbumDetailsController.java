package com.khoaly.memora.feature.album.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.feature.album.dto.AlbumResponse;
import com.khoaly.memora.feature.album.dto.UpdateAlbumRequest;
import com.khoaly.memora.feature.album.service.AlbumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/albums")
@RequiredArgsConstructor
public class AlbumDetailsController {

    private final AlbumService albumService;

    @GetMapping("/{id}")
    public ApiResponse<AlbumResponse> getAlbum(@PathVariable String id) {
        return ApiResponse.success(albumService.getAlbumById(id));
    }

    @PatchMapping("/{id}")
    public ApiResponse<AlbumResponse> updateAlbum(
            @PathVariable String id,
            @RequestBody @Valid UpdateAlbumRequest request) {
        return ApiResponse.success(albumService.updateAlbum(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAlbum(@PathVariable String id) {
        albumService.deleteAlbum(id);
        return ApiResponse.success(null);
    }
}
