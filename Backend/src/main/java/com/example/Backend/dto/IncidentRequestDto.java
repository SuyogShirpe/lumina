package com.example.Backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record IncidentRequestDto(
        String title,
        String description,
        Integer categoryId,
        BigDecimal lat,
        BigDecimal lng,
        LocalDateTime occurredAt
) {
}

