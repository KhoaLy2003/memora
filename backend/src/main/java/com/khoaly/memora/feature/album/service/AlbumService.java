package com.khoaly.memora.feature.album.service;

import com.khoaly.memora.common.exception.ResourceNotFoundException;
import com.khoaly.memora.feature.album.dto.AlbumResponse;
import com.khoaly.memora.feature.album.dto.CreateAlbumRequest;
import com.khoaly.memora.feature.album.entity.Album;
import com.khoaly.memora.feature.album.repository.AlbumRepository;
import com.khoaly.memora.feature.group.entity.Group;
import com.khoaly.memora.feature.group.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final GroupRepository groupRepository;

    @Value("${default-album-cover-image-url}")
    private String defaultAlbumCoverImageUrl;

    @Transactional
    public AlbumResponse createAlbum(String groupId, CreateAlbumRequest request) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found: " + groupId));

        Album album = new Album();
        album.setName(request.getName());
        album.setDescription(request.getDescription());
        album.setGroup(group);
        album.setCoverMediaUrl(defaultAlbumCoverImageUrl);

        Album savedAlbum = albumRepository.save(album);
        return mapToResponse(savedAlbum);
    }

    public List<AlbumResponse> getAlbumsByGroup(String groupId) {
        return albumRepository.findByGroupId(groupId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AlbumResponse getAlbumById(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found: " + id));
        return mapToResponse(album);
    }

    @Transactional
    public AlbumResponse updateAlbum(String id, com.khoaly.memora.feature.album.dto.UpdateAlbumRequest request) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found: " + id));

        if (request.getName() != null)
            album.setName(request.getName());
        if (request.getDescription() != null)
            album.setDescription(request.getDescription());
        if (request.getCoverMediaUrl() != null)
            album.setCoverMediaUrl(request.getCoverMediaUrl());

        return mapToResponse(albumRepository.save(album));
    }

    @Transactional
    public void deleteAlbum(String id) {
        if (!albumRepository.existsById(id)) {
            throw new ResourceNotFoundException("Album not found: " + id);
        }
        albumRepository.deleteById(id);
    }

    private AlbumResponse mapToResponse(Album album) {
        return AlbumResponse.builder()
                .id(album.getId())
                .name(album.getName())
                .description(album.getDescription())
                .coverMediaUrl(album.getCoverMediaUrl())
                .groupId(album.getGroup().getId())
                .createdAt(album.getCreatedAt())
                .build();
    }
}
