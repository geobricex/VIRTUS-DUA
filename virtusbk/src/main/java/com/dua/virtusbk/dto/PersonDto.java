package com.dua.virtusbk.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class PersonDto implements Serializable {
    private final Long id;
    private final String namePerson;
    private final String lastnamePerson;
    private final String emailPerson;
    private final String typePerson;
    private final LocalDateTime dateupdatePerson;
}
