package com.example.Backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long incidentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private IncidentCategory category;

    private String title;
    private String description;
    private BigDecimal lat;
    private BigDecimal lng;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Builder.Default
    private Integer upvoteCount = 0;

    private LocalDateTime occurredAt;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    private List<IncidentPhoto> photos;
    private List<IncidentVote> votes;

}