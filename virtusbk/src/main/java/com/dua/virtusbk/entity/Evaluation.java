package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Table(name = "evaluations")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Evaluation {
    public Evaluation(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_evaluation", unique = true, nullable = false)
    private Long id;

    @Column(name = "name_evaluation", nullable = false, length = 100)
    private String nameEvaluation;

    @Column(name = "description_evaluation", nullable = false, length = 100)
    private String descriptionEvaluation;

    @Column(name = "state_evaluation", nullable = false, length = 1)
    private String state_evaluation;

    @Column(name = "type_evaluation")
    private Integer typeEvaluation;

    @Column(name = "datereg_evaluation", nullable = false)
    private LocalDateTime dateregEvaluation;

    @Column(name = "dateupdate_evaluation", nullable = false)
    private LocalDateTime dateupdateEvaluation;

    @Column(name = "time_evaluation", nullable = false)
    private Boolean timeEvaluation = false;

    @Column(name = "timeminutes_evaluation")
    private Long timeminutesEvaluation;

    @Column(name = "opportunity_evaluation", nullable = false)
    private Boolean opportunityEvaluation = false;

    @Column(name = "opportunities_evaluation")
    private Long opportunitiesEvaluation;

    @Column(name = "numberquestion_evaluation")
    private Integer numberquestionEvaluation;

    @Column(name = "order_category")
    private Boolean orderCategory = true;

    @Column(name = "allows_review")
    private Boolean allowsReview = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "topics_id_topic", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Topic topicsIdTopic;

}
