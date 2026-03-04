package com.khoaly.memora.feature.album.repository;

import com.khoaly.memora.feature.album.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, String> {
    List<Album> findByGroupId(String groupId);
}
