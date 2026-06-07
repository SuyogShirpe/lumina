package com.example.Backend.dto;

public record CategoryDto(
        Integer categoryId,
        String name,
        String iconName,
        String colorHex
) {
}
