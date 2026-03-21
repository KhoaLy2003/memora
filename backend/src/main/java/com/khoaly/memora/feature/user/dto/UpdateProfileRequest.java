package com.khoaly.memora.feature.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    @NotBlank(message = "{validation.full_name_required}")
    private String fullName;
    private String avatarUrl;
}
