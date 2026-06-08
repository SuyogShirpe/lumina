package com.example.Backend.repo;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.IncidentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentCategoryRepo extends JpaRepository<IncidentCategory, Integer> {


}
