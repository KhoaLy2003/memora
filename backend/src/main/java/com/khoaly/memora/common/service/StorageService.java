package com.khoaly.memora.common.service;

import java.io.InputStream;

public interface StorageService {
    String uploadFile(String path, InputStream inputStream, String contentType, long size);

    String getPresignedUrl(String path);

    String getPresignedDownloadUrl(String path, String filename);

    void deleteFile(String path);
}
