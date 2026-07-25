package com.example.Backend.service;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.Status;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.mapper.IncidentMapper;
import com.example.Backend.repo.IncidentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AdminService {


    @Autowired
    private IncidentRepo incidentRepo;
    @Autowired
    private IncidentMapper incidentMapper;

    public AdminService(IncidentRepo incidentRepo, IncidentMapper incidentMapper) {
        this.incidentRepo = incidentRepo;
        this.incidentMapper = incidentMapper;
    }

    public Page<IncidentDto> getAllIncidents(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page , size , Sort.by("createdAt").descending());

        Page<Incident> incidents;
        if(status != null && !status.isBlank()){
            Status incidentStatus = Status.valueOf(status.toUpperCase());

            incidents = incidentRepo.findByStatus(incidentStatus, pageable);
        } else {
            incidents = incidentRepo.findAll(pageable);
        }

        return incidents.map(incident -> incidentMapper.toDto(incident, null));
    }
}
