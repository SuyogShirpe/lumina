package com.example.Backend.controller;

import com.example.Backend.dto.IncidentCategoryDto;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping("")
    public ResponseEntity<List<IncidentDto>> getNearbyIncidents(@RequestParam double lat,@RequestParam double lng,@RequestParam(defaultValue = "5.0") double radiusKm){
        List<IncidentDto> incidents = incidentService.getNearbyIncidents(lat, lng, radiusKm);

        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDto> getIncidentById(@PathVariable Long id){
        IncidentDto incident = incidentService.getIncidentById(id);

        return ResponseEntity.ok(incident);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<IncidentCategoryDto>> getAllCategories(){
        List<IncidentCategoryDto> categoryDto = incidentService.getAllCategories();

        return ResponseEntity.ok(categoryDto);
    }
}
