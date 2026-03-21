package com.khoaly.memora.feature.user.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.common.util.SecurityUtils;
import com.khoaly.memora.feature.user.dto.UpdateProfileRequest;
import com.khoaly.memora.feature.user.dto.UserResponse;
import com.khoaly.memora.feature.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe() {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(userService.getUserProfile(userId));
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateMe(@RequestBody @Valid UpdateProfileRequest request) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(userService.updateProfile(userId, request));
    }
}
