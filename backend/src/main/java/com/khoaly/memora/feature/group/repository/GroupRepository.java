package com.khoaly.memora.feature.group.repository;

import com.khoaly.memora.feature.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, String> {
    Optional<Group> findByInviteCode(String inviteCode);

    Optional<Group> findByGuestInviteCode(String guestInviteCode);
}
