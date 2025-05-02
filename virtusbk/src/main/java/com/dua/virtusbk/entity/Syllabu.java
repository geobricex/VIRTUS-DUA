package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.Type;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Table(name = "syllabus")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Syllabu {
    @Id
    @SequenceGenerator(name="syllabus_id_syllabu_seq", sequenceName="syllabus_id_syllabu_seq", allocationSize=1)
    @GeneratedValue(generator="syllabus_id_syllabu_seq")
    @Column(name = "id_syllabu", nullable = false)
    private Long id;

    @Column(name = "name_syllabu", nullable = false, length = 50)
    private String nameSyllabu;

    @Column(name = "description_syllabu", nullable = false, length = 100)
    private String descriptionSyllabu;

    @Column(name = "keywords_syllabu")
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String keywordsSyllabu;

    @Column(name = "pathimg_syllabus", length = 200)
    private String pathimgSyllabus;

    @Column(name = "datereg_syllabu", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateregSyllabu;

    @Column(name = "dateupdate_syllabu", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateupdateSyllabu;

    @Column(name = "state_syllabu", nullable = false, length = 1)
    private String stateSyllabu;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "courses_id_course", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Course coursesIdCourse;

}
