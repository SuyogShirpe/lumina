package com.example.Backend.controller;

import com.example.Backend.dto.AuthResponseDto;
import com.example.Backend.dto.GoogleAuthRequestDto;
import com.example.Backend.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;



    @PostMapping("/google")
    public ResponseEntity<AuthResponseDto> authenticateResponse(@RequestBody GoogleAuthRequestDto request){

        return ResponseEntity.ok(googleAuthService.authenticateWithGoogle(request.idToken()));
    }
}
