package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Table(name = "persons")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
//@RequiredArgsConstructor

public class Person {
    public Person(Long id) {
        this.id = id;
    }

    @Id
    //@GeneratedValue(strategy = GenerationType.AUTO)
    //@GeneratedValue(strategy = GenerationType.SEQUENCE)
    //@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="webuser_idwebuser_seq")
    @SequenceGenerator(name = "persons_id_person_seq", sequenceName = "persons_id_person_seq", allocationSize = 1)
    @GeneratedValue(generator = "persons_id_person_seq")
    @Column(name = "id_person", nullable = false)
    private Long id;

    @Column(name = "name_person", nullable = false, length = 50)
    @Basic(optional = true)
    private String namePerson;

    @Column(name = "lastname_person", nullable = false, length = 50)
    @Basic(optional = true)
    private String lastnamePerson;

    @Column(name = "email_person", nullable = false, length = 75)
    @Basic(optional = true)
    private String emailPerson;

    @Column(name = "password_person", nullable = false, length = 64)
    @Basic(optional = true)
    private String passwordPerson;

    @Column(name = "type_person", nullable = false, length = 1)
    @Basic(optional = true)
    private String typePerson;

    @Column(name = "pathimg_person", length = 200)
    @Basic(optional = true)
    private String pathimgPerson;

    @Column(name = "codeverification_person", length = 15)
    @Basic(optional = true)
    private String codeverificationPerson;

    @Column(name = "datereg_person")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateregPerson;

    @Column(name = "dateupdate_person", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateupdatePerson;

    @Column(name = "provider_person", length = 20)
    @Basic(optional = true)
    private String providerPerson;

    @Column(name = "id_location", length = 20)
    @Basic(optional = true)
    private String idLocation;
}
