package com.example.Backend.dto;

import com.example.Backend.Model.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record IncidentDto(
        Long incidentId,
        String title,
        String description,
        BigDecimal lat,
        BigDecimal lng,
        Double distanceKm,
        Status status,
        Integer upvoteCount,
        LocalDateTime occurredAt,
        LocalDateTime createdAt,
        CategoryDto category,
        UserSummaryDto reporter,
        List<String> photoUrls
) {
}
