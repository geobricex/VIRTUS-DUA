package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name = "persons_evaluations")
@Entity
@Data
@NoArgsConstructor
@ToString
public class PersonsEvaluations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_person_evaluation", unique = true, nullable = false)
    private Long id;

    @Column(name = "result_evaluation", nullable = false)
    @JsonIgnore
    private String resultEvaluation;

    @Column(name = "datereg_person_evaluation", nullable = false)
    private LocalDateTime dateregPersonEvaluation;

    @Column(name = "qualification_person_evaluation", nullable = false)
    private Double qualificationPersonEvaluation;

    @Column(name = "trynumber_person_evaluation", nullable = false)
    private Integer trynumberPersonEvaluation;

    @Column(name = "timespent_person_evaluation")
    private Double timespentPersonEvaluation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "persons_id_person", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Person personsIdPerson;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "evaluations_id_evaluation", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Evaluation evaluationsIdEvaluation;

}
