package com.khoaly.memora.common.exception;

import com.khoaly.memora.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.stream.Collectors;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    @Autowired
    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        String message = messageSource.getMessage("error.not_found", null, ex.getMessage(), LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex) {
        String message = messageSource.getMessage("error.bad_request", null, ex.getMessage(), LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> {
                    String fieldName = error.getField();
                    String errorMessage = messageSource.getMessage(error, LocaleContextHolder.getLocale());
                    return fieldName + ": " + errorMessage;
                })
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message));
    }


    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        String message = messageSource.getMessage("error.file_too_large", null, "File size too large", LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception ex) {
        String message = messageSource.getMessage("error.internal", null, "Internal server error", LocaleContextHolder.getLocale());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(message));
    }
}
