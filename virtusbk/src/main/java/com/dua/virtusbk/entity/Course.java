package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

@Table(name = "courses")
@Data
@NoArgsConstructor
@Entity
@ToString

public class Course {
    public Course(Long id) {
        this.id = id;
    }

    @Id
    @SequenceGenerator(name = "courses_id_course_seq", sequenceName = "courses_id_course_seq", allocationSize = 1)
    @GeneratedValue(generator = "courses_id_course_seq")
    @Column(name = "id_course", nullable = false)
    private Long id;

    @Column(name = "name_course", nullable = false, length = 50)
    private String nameCourse;

    @Column(name = "description_course", nullable = false, length = 100)
    private String descriptionCourse;

    @Column(name = "keywords_course")
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String keywordsCourse;

    @Column(name = "pathimg_course", length = 400)
    private String pathimgCourse;

    @Column(name = "datereg_course", nullable = false)
    private LocalDateTime dateregCourse;

    @Column(name = "dateupdate_course", nullable = false)
    private LocalDateTime dateupdateCourse;

    @Column(name = "state_course", nullable = false, length = 1)
    private String stateCourse;

    @Column(name = "language_course", length = 20)
    private String languageCourse;

    @Column(name = "price_course", precision = 2)
    private BigDecimal priceCourse;

    @ManyToOne
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "persons_id_person", nullable = false)
    //@JsonIgnore// No traer toda la relación en una consulta
    private Person personsIdPerson;

}
