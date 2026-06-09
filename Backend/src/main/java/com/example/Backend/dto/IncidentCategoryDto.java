package com.example.Backend.dto;

public record IncidentCategoryDto(
        Integer categoryId,
        String name,
        String iconName,
        String colorHex
) {
}
