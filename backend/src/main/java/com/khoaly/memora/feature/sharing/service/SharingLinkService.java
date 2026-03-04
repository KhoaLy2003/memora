package com.khoaly.memora.feature.sharing.service;

import com.khoaly.memora.common.exception.ResourceNotFoundException;
import com.khoaly.memora.feature.album.entity.Album;
import com.khoaly.memora.feature.album.repository.AlbumRepository;
import com.khoaly.memora.feature.sharing.dto.SharingLinkResponse;
import com.khoaly.memora.feature.sharing.entity.SharingLink;
import com.khoaly.memora.feature.sharing.repository.SharingLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SharingLinkService {

    private final SharingLinkRepository sharingLinkRepository;
    private final AlbumRepository albumRepository;

    public SharingLinkResponse createLink(String albumId, Integer expiresAfterDays, boolean allowUpload) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found: " + albumId));

        SharingLink link = new SharingLink();
        link.setAlbum(album);
        link.setToken(UUID.randomUUID().toString().replace("-", ""));
        link.setAllowUpload(allowUpload);

        if (expiresAfterDays != null) {
            link.setExpiresAt(LocalDateTime.now().plusDays(expiresAfterDays));
        }

        SharingLink savedLink = sharingLinkRepository.save(link);

        return mapToResponse(savedLink);
    }

    public SharingLinkResponse getByToken(String token) {
        SharingLink link = sharingLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired sharing link"));

        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Sharing link has expired");
        }

        return mapToResponse(link);
    }

    private SharingLinkResponse mapToResponse(SharingLink link) {
        return SharingLinkResponse.builder()
                .token(link.getToken())
                .albumId(link.getAlbum().getId())
                .expiresAt(link.getExpiresAt())
                .allowUpload(link.isAllowUpload())
                .shareUrl("/shared/" + link.getToken()) // Placeholder app URL
                .build();
    }
}
