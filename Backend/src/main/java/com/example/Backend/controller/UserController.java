package com.example.Backend.controller;

import com.example.Backend.dto.UserDto;
import com.example.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
