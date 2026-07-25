package com.example.Backend.controller;

import com.example.Backend.dto.IncidentDto;
import com.example.Backend.dto.UserDto;
import com.example.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        UserDto userDto = userService.getCurrentUser(email);

        return ResponseEntity.ok(userDto);

    }

    @GetMapping("/me/incidents")
    public ResponseEntity<List<IncidentDto>> getUserIncidents(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        List<IncidentDto> incidentDtos = userService.getUserIncidents(email);

        return ResponseEntity.ok(incidentDtos);
    }

    @DeleteMapping("/me/incidents/{id}")
    public ResponseEntity<Void> deleteIncident(Authentication authentication,  @PathVariable Long id){

        userService.deleteIncident(authentication.getName(), id);

        return ResponseEntity.noContent().build();
    }
}
