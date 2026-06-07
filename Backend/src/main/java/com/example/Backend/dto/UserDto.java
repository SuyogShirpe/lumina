package com.example.Backend.dto;

import com.example.Backend.Model.Role;

public record UserDto(
        Long userId,
        String email,
        String name,
        String avatarUrl,
        Role role
) {
}
