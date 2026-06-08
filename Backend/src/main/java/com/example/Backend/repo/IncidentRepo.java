package com.example.Backend.repo;

import com.example.Backend.Model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IncidentRepo extends JpaRepository<Incident, Long> {

    @Query(value = """
    SELECT *
    FROM (
        SELECT i.*,
               (
                   6371 * ACOS(
                       COS(RADIANS(:lat))
                       * COS(RADIANS(i.lat))
                       * COS(RADIANS(i.lng) - RADIANS(:lng))
                       + SIN(RADIANS(:lat))
                       * SIN(RADIANS(i.lat))
                   )
               ) AS distance
        FROM incidents i
        WHERE i.status = 'ACTIVE'
          AND i.lat BETWEEN (:lat - :radiusKm / 111)
                        AND (:lat + :radiusKm / 111)
          AND i.lng BETWEEN (:lng - :radiusKm / 111)
                        AND (:lng + :radiusKm / 111)
    ) nearby
    WHERE nearby.distance <= :radiusKm
    ORDER BY nearby.distance
    LIMIT 200
    """,
            nativeQuery = true)
    List<Incident> findIncidentsWithinRadius(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radiusKm") Double radiusKm);
}
