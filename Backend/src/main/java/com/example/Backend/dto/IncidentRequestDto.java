package com.example.Backend.dto;
import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public record IncidentRequestDto(
        @NotBlank(message="Title is required")
        @Size(max=100, message="Title must not exceed 100 characters")
        String title,

        @NotBlank(message="Description is required")
        @Size(max=1000, message="Description must not exceed 1000 characters")
        String description,

        @NotNull
        Integer categoryId,

        @NotNull
        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        BigDecimal lat,

        @NotNull
        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        BigDecimal lng,

        @NotNull
        LocalDateTime occurredAt
) {
}

