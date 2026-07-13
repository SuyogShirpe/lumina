package com.example.Backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.IncidentCategory;

@Repository
public interface IncidentCategoryRepo extends JpaRepository<IncidentCategory, Integer> {


}
