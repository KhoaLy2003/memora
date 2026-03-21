package com.khoaly.memora.feature.media.service;

import com.khoaly.memora.common.exception.ResourceNotFoundException;
import com.khoaly.memora.common.service.StorageService;
import com.khoaly.memora.feature.album.entity.Album;
import com.khoaly.memora.feature.album.repository.AlbumRepository;
import com.khoaly.memora.feature.group.entity.Group;
import com.khoaly.memora.feature.group.repository.GroupRepository;
import com.khoaly.memora.feature.media.dto.MediaResponse;
import com.khoaly.memora.feature.media.entity.Media;
import com.khoaly.memora.feature.media.repository.MediaRepository;
import com.khoaly.memora.feature.user.entity.User;
import com.khoaly.memora.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    private final MediaRepository mediaRepository;
    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final StorageService storageService;
    private final ImageProcessorService imageProcessorService;

    @Transactional
    public MediaResponse uploadMedia(String albumId, String uploaderId, MultipartFile file) throws IOException {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found: " + albumId));

        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + uploaderId));

        Group group = album.getGroup();

        // Check storage quota
        if (group.getUsedStorageBytes() + file.getSize() > group.getStorageLimitBytes()) {
            throw new RuntimeException("Storage limit exceeded");
        }

        String extension = getExtension(file.getOriginalFilename());
        String baseId = UUID.randomUUID().toString();
        String originalPath = String.format("groups/%s/albums/%s/originals/%s%s",
                group.getId(), album.getId(), baseId, extension);

        // Upload original
        String contentType = file.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        if (contentType.startsWith("image")) {
            // Buffer in memory only for images to allow multiple reads (storage + thumbnail)
            byte[] fileBytes = file.getBytes();
            storageService.uploadFile(originalPath, new ByteArrayInputStream(fileBytes), contentType, file.getSize());

            // Process thumbnail
            try {
                byte[] thumbData = imageProcessorService.createThumbnail(new ByteArrayInputStream(fileBytes));
                String thumbPath = String.format("groups/%s/albums/%s/thumbs/%s.jpg",
                        group.getId(), album.getId(), baseId);
                storageService.uploadFile(thumbPath, new ByteArrayInputStream(thumbData), "image/jpeg",
                        thumbData.length);
            } catch (Exception e) {
                log.error("Failed to create thumbnail for {}", file.getOriginalFilename(), e);
            }
        } else {
            // STREAM directly for videos to avoid OOM (Out Of Memory)
            try (InputStream inputStream = file.getInputStream()) {
                storageService.uploadFile(originalPath, inputStream, contentType, file.getSize());
            }
        }

        Media media = new Media();
        media.setFileName(file.getOriginalFilename());
        media.setStoragePath(originalPath);
        // We could also store thumbPath in metadata or a separate column
        media.setSizeBytes(file.getSize());
        media.setFileType(contentType.startsWith("video") ? Media.MediaType.VIDEO : Media.MediaType.IMAGE);
        media.setAlbum(album);
        media.setUploader(uploader);

        Media savedMedia = mediaRepository.save(media);

        group.setUsedStorageBytes(group.getUsedStorageBytes() + file.getSize());
        groupRepository.save(group);

        return mapToResponse(savedMedia);
    }

    @Transactional
    public void deleteMedia(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found: " + id));

        Group group = media.getAlbum().getGroup();
        group.setUsedStorageBytes(Math.max(0, group.getUsedStorageBytes() - media.getSizeBytes()));
        groupRepository.save(group);

        storageService.deleteFile(media.getStoragePath());
        // Also delete thumb if it was created
        if (media.getFileType() == Media.MediaType.IMAGE) {
            String thumbPath = media.getStoragePath().replace("originals", "thumbs")
                    .replace(getExtension(media.getStoragePath()), ".jpg");
            storageService.deleteFile(thumbPath);
        }

        mediaRepository.delete(media);
    }

    public String getDownloadUrl(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found: " + id));
        return storageService.getPresignedDownloadUrl(media.getStoragePath(), media.getFileName());
    }

    public List<MediaResponse> getMediaByAlbum(String albumId) {
        return mediaRepository.findByAlbumId(albumId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains("."))
            return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    private MediaResponse mapToResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .fileName(media.getFileName())
                .fileType(media.getFileType())
                .sizeBytes(media.getSizeBytes())
                .metadata(media.getMetadata())
                .albumId(media.getAlbum().getId())
                .uploaderId(media.getUploader().getId())
                .downloadUrl(storageService.getPresignedUrl(media.getStoragePath()))
                .uploadedAt(media.getCreatedAt())
                .build();
    }
}
