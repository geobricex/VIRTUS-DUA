package com.dua.virtusbk.entity;

import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.QuestionCategory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(name = "evaluation_question_category")
public class EvaluationQuestionCategory {

    public EvaluationQuestionCategory() {

    }

    public EvaluationQuestionCategory(Evaluation evaluationsIdEvaluation, QuestionCategory questionCategoryIdQuestioncategory, Integer numberQuestion) {
        this.evaluationsIdEvaluation = evaluationsIdEvaluation;
        this.questionCategoryIdQuestioncategory = questionCategoryIdQuestioncategory;
        this.numberQuestion = numberQuestion;
    }

    @Id
    @SequenceGenerator(name = "evaluation_question_category_id_evaluation_question_category_se", sequenceName = "evaluation_question_category_id_evaluation_question_category_se", allocationSize = 1)
    @GeneratedValue(generator = "evaluation_question_category_id_evaluation_question_category_se")
    @Column(name = "id_evaluation_question_category", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluations_id_evaluation", nullable = false)
    private Evaluation evaluationsIdEvaluation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_category_id_questioncategory", nullable = false)
    private QuestionCategory questionCategoryIdQuestioncategory;

    @Column(name = "number_question", nullable = false)
    private Integer numberQuestion;


}
