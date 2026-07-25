package com.example.Backend.service;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.User;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.dto.UserDto;
import com.example.Backend.exception.AccessDeniedException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.IncidentMapper;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.repo.IncidentRepo;
import com.example.Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private IncidentRepo incidentRepo;
    @Autowired
    private IncidentMapper incidentMapper;

    public UserDto getCurrentUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        return userMapper.toDto(user);
    }

    public List<IncidentDto> getUserIncidents(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));
        List<Incident> incidents = incidentRepo.findByUser(user);

        return incidents.stream()
                .map(incident -> incidentMapper.toDto(incident, null))
                .toList();
    }

    public void deleteIncident(String email, Long id) {

        Incident incident = incidentRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));

        if(incident.getUser().getEmail().equals(email)){
            incidentRepo.delete(incident);
        } else {
            throw new AccessDeniedException("You can only delete your own incidents.");
        }
    }
}
