package com.khoaly.memora.feature.group.controller;

import com.khoaly.memora.common.dto.ApiResponse;
import com.khoaly.memora.common.util.SecurityUtils;
import com.khoaly.memora.feature.group.dto.CreateGroupRequest;
import com.khoaly.memora.feature.group.dto.GroupResponse;
import com.khoaly.memora.feature.group.dto.MemberResponse;
import com.khoaly.memora.feature.group.dto.UpdateGroupRequest;
import com.khoaly.memora.feature.group.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<GroupResponse> createGroup(@RequestBody @Valid CreateGroupRequest request) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.createGroup(request, userId));
    }

    @PatchMapping("/{groupId}")
    public ApiResponse<GroupResponse> updateGroup(
            @PathVariable String groupId,
            @RequestBody UpdateGroupRequest request) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.updateGroup(groupId, request, userId));
    }

    @GetMapping
    public ApiResponse<List<GroupResponse>> getMyGroups() {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.getUserGroups(userId));
    }

    @GetMapping("/{groupId}")
    public ApiResponse<GroupResponse> getGroupDetails(@PathVariable String groupId) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.getGroupDetails(groupId, userId));
    }

    @GetMapping("/{groupId}/members")
    public ApiResponse<List<MemberResponse>> getMembers(@PathVariable String groupId) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.getGroupMembers(groupId, userId));
    }

    @PostMapping("/join")
    public ApiResponse<GroupResponse> joinGroup(@RequestParam String inviteCode) {
        String userId = securityUtils.getCurrentUserId();
        return ApiResponse.success(groupService.joinGroupByCode(inviteCode, userId));
    }

    @PostMapping("/{groupId}/leave")
    public ApiResponse<Void> leaveGroup(@PathVariable String groupId) {
        String userId = securityUtils.getCurrentUserId();
        groupService.leaveGroup(groupId, userId);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{groupId}")
    public ApiResponse<Void> deleteGroup(@PathVariable String groupId) {
        String userId = securityUtils.getCurrentUserId();
        groupService.deleteGroup(groupId, userId);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ApiResponse<Void> removeMember(@PathVariable String groupId, @PathVariable String memberId) {
        String userId = securityUtils.getCurrentUserId();
        groupService.removeMember(groupId, memberId, userId);
        return ApiResponse.success(null);
    }
}
