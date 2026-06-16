package com.example.Backend.service;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.IncidentCategory;
import com.example.Backend.dto.IncidentCategoryDto;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.mapper.IncidentCategoryMapper;
import com.example.Backend.mapper.IncidentMapper;
import com.example.Backend.repo.IncidentCategoryRepo;
import com.example.Backend.repo.IncidentRepo;
import com.example.Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepo incidentRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private IncidentCategoryRepo incidentCategoryRepo;

    @Autowired
    private IncidentMapper incidentMapper;
    @Autowired
    private IncidentCategoryMapper incidentCategoryMapper;

    private double calculateDistance(double lat1, double lng1, double lat2,double lng2){
        final double earth_radiusKm = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1)) *
                Math.cos(Math.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earth_radiusKm * c;
    }


    public List<IncidentDto> getNearbyIncidents(double lat, double lng, double radiusKm){

        List<Incident> incidents = incidentRepo.findIncidentsWithinRadius(lat, lng, radiusKm);


        return incidents.stream()
                .map(incident -> {

                    double distanceKm = calculateDistance(lat, lng, incident.getLat().doubleValue(), incident.getLng().doubleValue());

                    return incidentMapper.toDto(incident, distanceKm);
                })
                .toList();
    }


    public IncidentDto getIncidentById(Long id){
        Optional<Incident> incident = incidentRepo.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found out with id: " +id));

        IncidentDto dto = incidentMapper.toDto(incident, null);

        return dto;
    }


    public List<IncidentCategoryDto> getAllCategories(){
        List<IncidentCategory> incidentCategories = incidentCategoryRepo.findAll();

        return incidentCategories.stream()
                .map(incidentCategory -> {
                    IncidentCategoryDto categoryDto = incidentCategoryMapper.toDto(incidentCategory);
                    return categoryDto;
                })
                .toList();
    }
}
