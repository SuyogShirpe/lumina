package com.example.Backend.repo;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.IncidentVote;
import com.example.Backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentVoteRepo extends JpaRepository<IncidentVote, Long> {

    boolean existsByIncidentAndUser(Incident incident, User user);

    long countByIncident(Incident incident);
}
