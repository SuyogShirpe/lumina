package com.example.Backend.mapper;


import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.Backend.Model.Incident;
import com.example.Backend.Model.IncidentPhoto;
import com.example.Backend.dto.IncidentDto;
import com.example.Backend.dto.IncidentRequestDto;

@Mapper(componentModel = "spring",
        uses = {
        IncidentCategoryMapper.class , UserMapper.class
        })
public interface IncidentMapper {

    @Mapping(source = "user", target = "reporter")
    @Mapping(source = "photos", target = "photoUrls")
    @Mapping(target = "distanceKm", ignore = true)
    @Mapping(target = "userHasVoted", ignore = true)
    IncidentDto toDto(Incident incident, @Context Double distanceKm);

    @Mapping(target = "incidentId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "upvoteCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "votes", ignore = true)
    Incident toEntity(IncidentRequestDto incidentRequestDto);

    @AfterMapping
    default void setDistance(@MappingTarget IncidentDto incidentDto,
                             @Context Double distanceKm){
        if(distanceKm != null){
            incidentDto.setDistanceKm(distanceKm);
        }
    }

    default List<String> photoToUrls(List<IncidentPhoto> photos){
        if(photos == null) return List.of();

        return photos.stream()
                .map(IncidentPhoto::getPhotoUrl)
                .toList();
    }

}
