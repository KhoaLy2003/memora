package com.khoaly.memora.feature.media.repository;

import com.khoaly.memora.feature.media.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, String> {
    List<Media> findByAlbumId(String albumId);
}
