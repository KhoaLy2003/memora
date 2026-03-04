package com.khoaly.memora.feature.group.service;

import com.khoaly.memora.common.exception.ResourceNotFoundException;
import com.khoaly.memora.feature.album.repository.AlbumRepository;
import com.khoaly.memora.feature.group.dto.CreateGroupRequest;
import com.khoaly.memora.feature.group.dto.GroupResponse;
import com.khoaly.memora.feature.group.dto.MemberResponse;
import com.khoaly.memora.feature.group.dto.UpdateGroupRequest;
import com.khoaly.memora.feature.group.entity.Group;
import com.khoaly.memora.feature.group.entity.Membership;
import com.khoaly.memora.feature.group.repository.GroupRepository;
import com.khoaly.memora.feature.group.repository.MembershipRepository;
import com.khoaly.memora.feature.media.repository.MediaRepository;
import com.khoaly.memora.feature.media.service.MediaService;
import com.khoaly.memora.feature.user.entity.User;
import com.khoaly.memora.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final MediaRepository mediaRepository;
    private final MediaService mediaService;

    private static final long DEFAULT_STORAGE_LIMIT = 5L * 1024 * 1024 * 1024; // 5 GB default

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, String ownerUserId) {
        User owner = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + ownerUserId));

        Group group = new Group();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setStorageLimitBytes(
                request.getStorageLimitBytes() != null ? request.getStorageLimitBytes() : DEFAULT_STORAGE_LIMIT);
        group.setInviteCode(generateUniqueInviteCode());
        group.setGuestInviteCode(generateUniqueInviteCode());

        Group savedGroup = groupRepository.save(group);

        Membership membership = new Membership();
        membership.setUser(owner);
        membership.setGroup(savedGroup);
        membership.setRole(Membership.Role.OWNER);
        membershipRepository.save(membership);

        return mapToResponse(savedGroup, Membership.Role.OWNER.name());
    }

    public List<GroupResponse> getUserGroups(String userId) {
        return membershipRepository.findByUserId(userId).stream()
                .map(m -> mapToResponse(m.getGroup(), m.getRole().name()))
                .toList();
    }

    public GroupResponse getGroupDetails(String groupId, String userId) {
        Membership membership = membershipRepository.findByUserIdAndGroupId(userId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        return mapToResponse(membership.getGroup(), membership.getRole().name());
    }

    public List<MemberResponse> getGroupMembers(String groupId, String userId) {
        if (!membershipRepository.existsByUserIdAndGroupId(userId, groupId)) {
            throw new ResourceNotFoundException("You are not a member of this group");
        }

        return membershipRepository.findByGroupId(groupId).stream()
                .map(this::mapToMemberResponse)
                .toList();
    }

    @Transactional
    public GroupResponse updateGroup(String groupId, UpdateGroupRequest request, String userId) {
        Membership membership = membershipRepository.findByUserIdAndGroupId(userId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        if (membership.getRole() != Membership.Role.OWNER) {
            throw new IllegalArgumentException("Only owners can update group settings");
        }

        Group group = membership.getGroup();
        if (request.getName() != null)
            group.setName(request.getName());
        if (request.getDescription() != null)
            group.setDescription(request.getDescription());
        if (request.getAvatarUrl() != null)
            group.setAvatarUrl(request.getAvatarUrl());

        return mapToResponse(groupRepository.save(group), membership.getRole().name());
    }

    @Transactional
    public GroupResponse joinGroupByCode(String inviteCode, String userId) {
        Group group = groupRepository.findByInviteCode(inviteCode)
                .orElse(null);

        boolean isGuest = false;
        if (group == null) {
            group = groupRepository.findByGuestInviteCode(inviteCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid invite code"));
            isGuest = true;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (membershipRepository.existsByUserIdAndGroupId(userId, group.getId())) {
            // Already a member
            Membership membership = membershipRepository.findByUserIdAndGroupId(userId, group.getId()).get();
            return mapToResponse(group, membership.getRole().name());
        }

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setGroup(group);
        membership.setRole(isGuest ? Membership.Role.VIEWER : Membership.Role.MEMBER);
        membershipRepository.save(membership);

        return mapToResponse(group, membership.getRole().name());
    }

    @Transactional
    public void deleteGroup(String groupId, String userId) {
        Membership membership = membershipRepository.findByUserIdAndGroupId(userId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        if (membership.getRole() != Membership.Role.OWNER) {
            throw new IllegalArgumentException("Only owners can delete the group");
        }

        Group group = membership.getGroup();

        // Delete all media (storage + DB) and albums
        albumRepository.findByGroupId(groupId).forEach(album -> {
            mediaRepository.findByAlbumId(album.getId()).forEach(media ->
                    mediaService.deleteMedia(media.getId()));
            albumRepository.delete(album);
        });

        groupRepository.delete(group);
    }

    @Transactional
    public void leaveGroup(String groupId, String userId) {
        Membership membership = membershipRepository.findByUserIdAndGroupId(userId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        if (membership.getRole() == Membership.Role.OWNER) {
            long ownerCount = membershipRepository.findByGroupId(groupId).stream()
                    .filter(m -> m.getRole() == Membership.Role.OWNER).count();
            if (ownerCount <= 1) {
                throw new IllegalArgumentException(
                        "Cannot leave group as the only owner. Delete the group instead or promote another member.");
            }
        }

        membershipRepository.delete(membership);
    }

    @Transactional
    public void removeMember(String groupId, String memberId, String requesterId) {
        Membership requesterMembership = membershipRepository.findByUserIdAndGroupId(requesterId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        if (requesterMembership.getRole() != Membership.Role.OWNER) {
            throw new IllegalArgumentException("Only owners can remove members");
        }

        Membership memberToRemove = membershipRepository.findByUserIdAndGroupId(memberId, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this group"));

        if (memberToRemove.getRole() == Membership.Role.OWNER) {
            throw new IllegalArgumentException("Cannot remove an owner");
        }

        membershipRepository.delete(memberToRemove);
    }

    private String generateUniqueInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private GroupResponse mapToResponse(Group group, String role) {
        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .storageLimitBytes(group.getStorageLimitBytes())
                .usedStorageBytes(group.getUsedStorageBytes())
                .avatarUrl(group.getAvatarUrl())
                .inviteCode(group.getInviteCode())
                .guestInviteCode(group.getGuestInviteCode())
                .userRole(role)
                .createdAt(group.getCreatedAt())
                .build();
    }

    private MemberResponse mapToMemberResponse(Membership membership) {
        User user = membership.getUser();
        return MemberResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(membership.getRole().name())
                .joinedAt(membership.getCreatedAt())
                .build();
    }
}
