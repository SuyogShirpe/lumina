package com.example.Backend.dto;

public record UserSummaryDto(
        Long userId,
        String name,
        String avatarUrl
) {
}
