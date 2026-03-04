package com.khoaly.memora.feature.sharing.repository;

import com.khoaly.memora.feature.sharing.entity.SharingLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SharingLinkRepository extends JpaRepository<SharingLink, String> {
    Optional<SharingLink> findByToken(String token);
}
