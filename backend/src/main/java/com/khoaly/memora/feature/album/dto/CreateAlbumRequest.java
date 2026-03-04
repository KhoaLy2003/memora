package com.khoaly.memora.feature.album.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAlbumRequest {
    @NotBlank(message = "Album name is required")
    private String name;
    private String description;
}
