package com.example.Backend.mapper;

import com.example.Backend.Model.IncidentCategory;
import com.example.Backend.dto.IncidentCategoryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IncidentCategoryMapper {

    IncidentCategoryDto toDto(IncidentCategory incidentCategory);

    IncidentCategory toEntity(IncidentCategoryDto incidentCategoryDto);
}
