package com.example.Backend.service;

import com.example.Backend.Model.*;
import com.example.Backend.dto.IncidentCategoryDto;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.dto.IncidentRequestDto;
import com.example.Backend.dto.VoteResponseDto;
import com.example.Backend.exception.CategoryNotFoundException;
import com.example.Backend.exception.IncidentNotFoundException;
import com.example.Backend.mapper.IncidentCategoryMapper;
import com.example.Backend.mapper.IncidentMapper;
import com.example.Backend.repo.IncidentCategoryRepo;
import com.example.Backend.repo.IncidentRepo;
import com.example.Backend.repo.IncidentVoteRepo;
import com.example.Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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
    @Autowired
    private IncidentVoteRepo incidentVoteRepo;

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
        Incident incident = incidentRepo.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));

        IncidentDto dto = incidentMapper.toDto(incident, null);

        try{
            User user = getCurrentUser();
            dto.setUserHasVoted(false);
            if(incidentVoteRepo.existsByIncidentAndUser(incident, user)){
                dto.setUserHasVoted(true);
            }
        } catch (UsernameNotFoundException e){
            System.out.println(e);
        }
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

    private User getCurrentUser(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email:"+email));
        return user;
    }

    public IncidentDto createIncident(IncidentRequestDto dto){
        IncidentCategory incidentCategory = incidentCategoryRepo.findById(dto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        Incident incident = Incident.builder()
                .user(getCurrentUser())
                .category(incidentCategory)
                .title(dto.title())
                .description(dto.description())
                .lat(dto.lat())
                .lng(dto.lng())
                .occurredAt(dto.occurredAt())
                .status(Status.ACTIVE)
                .upvoteCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        Incident savedIncident = incidentRepo.save(incident);

        IncidentDto incidentDto = incidentMapper.toDto(savedIncident,null);

        return incidentDto;

    }

    public VoteResponseDto toggleVote(Long incidentId){

        Incident incident = incidentRepo.findById(incidentId)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found"));

        User user = getCurrentUser();
        boolean userHasVoted;

        if(incidentVoteRepo.existsByIncidentAndUser(incident, user)){
            Optional<IncidentVote> vote = incidentVoteRepo.findByIncidentAndUser(incident, user);

            incidentVoteRepo.delete(vote.orElse(null));
            incident.setUpvoteCount(Math.max(0, incident.getUpvoteCount() - 1));
            userHasVoted = false;
        } else {
            IncidentVote incidentVote = IncidentVote.builder()
                    .incident(incident)
                    .user(user)
                    .votedAt(LocalDateTime.now())
                    .build();

            IncidentVote savedVote = incidentVoteRepo.save(incidentVote);
            incident.setUpvoteCount(incident.getUpvoteCount() + 1);
            userHasVoted = true;
        }

        incidentRepo.save(incident);

        return new VoteResponseDto(incidentId, incident.getUpvoteCount(), userHasVoted);
    }

    public IncidentDto updateIncidentStatus(Long incidentId, Status newStatus){
        Incident incident = incidentRepo.findById(incidentId)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found"));
        incident.setStatus(newStatus);

        Incident savedIncident = incidentRepo.save(incident);

        IncidentDto incidentDto = incidentMapper.toDto(savedIncident, null);

        return incidentDto;
    }

    public void deleteIncident(Long incidentId){
        Incident incident = incidentRepo.findById(incidentId)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found"));

        incidentRepo.delete(incident);
    }
}
