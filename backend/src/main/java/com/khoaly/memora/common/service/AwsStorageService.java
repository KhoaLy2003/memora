package com.khoaly.memora.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.InputStream;
import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
@Primary
public class AwsStorageService implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${storage.bucket}")
    private String bucket;

    @Override
    public String uploadFile(String path, InputStream inputStream, String contentType, long size) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(path)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, size));
            return path;
        } catch (Exception e) {
            log.error("Error uploading file to S3: {}", path, e);
            throw new RuntimeException("Failed to upload file to storage", e);
        }
    }

    @Override
    public String getPresignedUrl(String path) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofDays(7))
                    .getObjectRequest(builder -> builder.bucket(bucket).key(path).build())
                    .build();

            return s3Presigner.presignGetObject(presignRequest)
                    .url()
                    .toString()
                    .replace("https://api.memora.id.vn/", "https://api.memora.id.vn/storage/");
        } catch (Exception e) {
            log.error("Error generating presigned URL for: {}", path, e);
            return null;
        }
    }

    @Override
    public String getPresignedDownloadUrl(String path, String filename) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofDays(7))
                    .getObjectRequest(builder -> builder
                            .bucket(bucket)
                            .key(path)
                            .responseContentDisposition("attachment; filename=\"" + filename + "\"")
                            .build())
                    .build();

            return s3Presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            log.error("Error generating presigned download URL for: {}", path, e);
            return null;
        }
    }

    @Override
    public void deleteFile(String path) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(path)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", path, e);
        }
    }
}
