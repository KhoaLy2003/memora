package com.khoaly.memora.feature.user.service;

import com.khoaly.memora.common.exception.ResourceNotFoundException;
import com.khoaly.memora.feature.user.dto.UpdateProfileRequest;
import com.khoaly.memora.feature.user.dto.UserResponse;
import com.khoaly.memora.feature.user.entity.User;
import com.khoaly.memora.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setFullName(request.getFullName());
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        return mapToResponse(userRepository.save(user));
    }


    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
