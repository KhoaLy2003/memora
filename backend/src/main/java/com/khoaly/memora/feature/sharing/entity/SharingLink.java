package com.khoaly.memora.feature.sharing.entity;

import com.khoaly.memora.common.entity.BaseEntity;
import com.khoaly.memora.feature.album.entity.Album;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sharing_links")
@Getter
@Setter
@NoArgsConstructor
public class SharingLink extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    private LocalDateTime expiresAt;

    private String passwordHash;

    private boolean allowUpload = false;
}
