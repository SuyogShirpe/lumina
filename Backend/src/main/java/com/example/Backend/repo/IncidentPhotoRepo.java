package com.example.Backend.repo;

import com.example.Backend.Model.IncidentPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentPhotoRepo extends JpaRepository<IncidentPhoto, Long> {

    List<IncidentPhoto> findByIncident_IncidentId(Long incidentId);
}
