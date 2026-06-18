package com.example.Backend.dto;

import com.example.Backend.Model.Status;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateDto(
        @NotNull
        Status status
) {
}
