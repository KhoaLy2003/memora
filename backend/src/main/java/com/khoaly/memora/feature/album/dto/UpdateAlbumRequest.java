package com.khoaly.memora.feature.album.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAlbumRequest {
    private String name;
    private String description;
    private String coverMediaUrl;
}
