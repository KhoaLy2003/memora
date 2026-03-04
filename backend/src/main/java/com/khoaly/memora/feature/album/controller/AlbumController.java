package com.khoaly.memora.feature.album.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.feature.album.dto.AlbumResponse;
import com.khoaly.memora.feature.album.dto.CreateAlbumRequest;
import com.khoaly.memora.feature.album.service.AlbumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AlbumResponse> createAlbum(
            @PathVariable String groupId,
            @RequestBody @Valid CreateAlbumRequest request) {
        return ApiResponse.success(albumService.createAlbum(groupId, request));
    }

    @GetMapping
    public ApiResponse<List<AlbumResponse>> getAlbums(@PathVariable String groupId) {
        return ApiResponse.success(albumService.getAlbumsByGroup(groupId));
    }
}
