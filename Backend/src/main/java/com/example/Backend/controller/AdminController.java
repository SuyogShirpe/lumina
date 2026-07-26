package com.example.Backend.controller;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/incidents")
    public Page<IncidentDto> getAllIncidents(@RequestParam(defaultValue = "0") int page ,@RequestParam(defaultValue = "10") int size ,@RequestParam(required = false) String status){

        return adminService.getAllIncidents(0,10,status);
    }

    @GetMapping("/stats")
    public Map<String , Long> getStats(){

        return adminService.getStats();
    }
}
