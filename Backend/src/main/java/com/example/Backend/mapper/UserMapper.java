package com.example.Backend.mapper;

import com.example.Backend.Model.User;
import com.example.Backend.dto.UserDto;
import com.example.Backend.dto.UserSummaryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    UserSummaryDto toSummaryDto(User user);

}

