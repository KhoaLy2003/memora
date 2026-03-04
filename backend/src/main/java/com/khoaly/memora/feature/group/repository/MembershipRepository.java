package com.khoaly.memora.feature.group.repository;

import com.khoaly.memora.feature.group.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, String> {
    List<Membership> findByUserId(String userId);

    List<Membership> findByGroupId(String groupId);

    Optional<Membership> findByUserIdAndGroupId(String userId, String groupId);

    boolean existsByUserIdAndGroupId(String userId, String groupId);
}
