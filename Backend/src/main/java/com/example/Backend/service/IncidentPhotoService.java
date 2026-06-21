package com.example.Backend.service;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.IncidentPhoto;
import com.example.Backend.exception.IncidentNotFoundException;
import com.example.Backend.exception.PhotoLimitExceededException;
import com.example.Backend.repo.IncidentPhotoRepo;
import com.example.Backend.repo.IncidentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentPhotoService {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private IncidentRepo incidentRepo;

    @Autowired
    private IncidentPhotoRepo incidentPhotoRepo;

    public List<String> uploadPhotos(Long incidentId , List<MultipartFile> files){

        Incident incident = incidentRepo.findById(incidentId)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found"));

        int photosCount = incidentPhotoRepo.findByIncident_IncidentId(incidentId).size();

        if((photosCount + files.size()) > 3){
            throw new PhotoLimitExceededException("Maximum 3 photos per incident");
        }

        List<String> photoUrls = new ArrayList<>();
        for(MultipartFile file : files){
            String fileUrl = fileStorageService.storeFile(file);

            IncidentPhoto incidentPhoto = IncidentPhoto.builder()
                    .incident(incident)
                    .photoUrl(fileUrl)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            incidentPhotoRepo.save(incidentPhoto);
            photoUrls.add(fileUrl);
        }


        return photoUrls;

    }

}
