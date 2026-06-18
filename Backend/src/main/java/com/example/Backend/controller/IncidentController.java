package com.example.Backend.controller;

import com.example.Backend.dto.*;
import com.example.Backend.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping
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

    @PostMapping
    public ResponseEntity<IncidentDto> createIncident(@RequestBody @Valid IncidentRequestDto dto){

        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.createIncident(dto));
    }

    @PutMapping("/{id}/vote")
    public ResponseEntity<VoteResponseDto> toggleVote(@PathVariable  Long id){

        return ResponseEntity.ok(incidentService.toggleVote(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentDto> updateIncidentStatus(@PathVariable Long id, @RequestBody StatusUpdateDto statusUpdateDto){
        return ResponseEntity.ok(incidentService.updateIncidentStatus(id, statusUpdateDto.status()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteIncident(@PathVariable Long id){
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
