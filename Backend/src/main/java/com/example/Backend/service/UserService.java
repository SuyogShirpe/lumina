package com.example.Backend.service;

import com.example.Backend.Model.User;
import com.example.Backend.dto.UserDto;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service

public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserMapper userMapper;

    public UserDto getCurrentUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        return userMapper.toDto(user);
    }
}
