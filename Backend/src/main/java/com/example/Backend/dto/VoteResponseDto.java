package com.example.Backend.dto;

public record VoteResponseDto
        (
        Long incidentId,
        Integer upvoteCount,
        Boolean userHasVoted
        ) {
}
