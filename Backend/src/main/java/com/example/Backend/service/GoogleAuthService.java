package com.example.Backend.service;

import com.example.Backend.Model.Role;
import com.example.Backend.Model.User;
import com.example.Backend.dto.AuthResponseDto;
import com.example.Backend.dto.UserDto;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.repo.UserRepo;
import com.example.Backend.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

@Service
public class GoogleAuthService {

    @Autowired
    private GoogleIdTokenVerifier verifier;

    @Autowired
    UserRepo userRepo;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    private UserMapper userMapper;

    public AuthResponseDto authenticateWithGoogle(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);

        if(idToken == null){
            throw new BadCredentialsException("Invalid google Id token");
        }
        GoogleIdToken.Payload payload = idToken.getPayload();

        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String avatarUrl = (String) payload.get("picture");

        User user = userRepo
                .findByGoogleId(googleId)
                .orElseGet(()->{
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .name(name)
                            .avatarUrl(avatarUrl)
                            .role(Role.USER)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return userRepo.save(newUser);
                });

        String jwt = jwtUtil.generateToken(user);

        UserDto userDto = userMapper.toDto(user);


        return new AuthResponseDto(jwt, userDto);
    }
}
