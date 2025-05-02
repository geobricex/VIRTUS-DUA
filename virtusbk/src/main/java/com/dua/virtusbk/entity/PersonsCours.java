package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.json.JSONObject;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name = "persons_courses")
@Entity
@Data
@NoArgsConstructor
@ToString
@JsonFormat
public class PersonsCours {
    @Id
    @SequenceGenerator(name = "persons_courses_id_person_course_seq", sequenceName = "persons_courses_id_person_course_seq", allocationSize = 1)
    @GeneratedValue(generator = "persons_courses_id_person_course_seq")
    @Column(name = "id_person_course", nullable = false)
    private Long id;

    @Column(name = "datereg_person_course", nullable = false)
    private LocalDateTime dateregPersonCourse;

    @Column(name = "state_person_course", nullable = false, length = 1)
    private String statePersonCourse;

    @ManyToOne(optional = false)
    @JoinColumn(name = "courses_id_course", nullable = false)
    private Course coursesIdCourse;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value = {org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "persons_id_person", nullable = false)
    @JsonIgnore// No traer toda la relación en una consulta
    private Person personsIdPerson;

}
