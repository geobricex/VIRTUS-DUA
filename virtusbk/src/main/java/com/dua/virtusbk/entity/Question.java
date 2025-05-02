package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;

@Table(name = "questions")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Question {

    public Question(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_question", unique = true, nullable = false)
    private Long id;

    /*@Id
    @SequenceGenerator(name="persons_courses_id_person_course_seq", sequenceName="persons_courses_id_person_course_seq", allocationSize=1)
    @GeneratedValue(generator="persons_courses_id_person_course_seq")
    @Column(name = "id_question", nullable = false)
    private Long id;*/

    @Column(name = "title_question", nullable = false, length = 200)
    private String titleQuestion;

    @Column(name = "description_question", nullable = false, length = 500)
    private String descriptionQuestion;

    @Column(name = "feedback_question", nullable = false, length = 100)
    private String feedbackQuestion;

    @Column(name = "hint_question", length = 200)
    private String hintQuestion;

    @Column(name = "pathurlsign_question", length = 200)
    private String pathurlsignQuestion;

    @Column(name = "pathurlvideo_question", length = 200)
    private String pathurlvideoQuestion;

    @Column(name = "pathurlfile_question", length = 200)
    private String pathurlfileQuestion;

    @Column(name = "points_question")
    private Boolean pointsQuestion;

    @Column(name = "maximumpoints_question")
    private Integer maximumpointsQuestion;

    @Column(name = "state_question", nullable = false, length = 1)
    private String stateQuestion;

    @Column(name = "level_question", nullable = false)
    private Integer levelQuestion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "evaluations_id_evaluation", nullable = false)
    //@JsonIgnore// No traer toda la relación en una consulta
    private Evaluation evaluationsIdEvaluation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_category_id_questioncategory", nullable = false)
    //@JsonIgnore
    private QuestionCategory questionCategoryIdQuestionCategory;
}
