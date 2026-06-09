package com.example.Backend.dto;

import com.example.Backend.Model.Status;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class IncidentDto {
    Long incidentId;
    String title;
    String description;
    BigDecimal lat;
    BigDecimal lng;
    Double distanceKm;
    Status status;
    Integer upvoteCount;
    LocalDateTime occurredAt;
    LocalDateTime createdAt;
    IncidentCategoryDto category;
    UserSummaryDto reporter;
    List<String> photoUrls;
}
