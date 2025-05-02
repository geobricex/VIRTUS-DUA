package com.dua.virtusbk.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Table(name = "question_category")
@Entity
@Data
@NoArgsConstructor
@ToString
public class QuestionCategory {
    public QuestionCategory(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_questioncategory", unique = true, nullable = false)
    private Long id;

    /*@Id
    @SequenceGenerator(name = "question_category_id_questioncategory_seq", sequenceName = "question_category_id_questioncategory_seq", allocationSize = 1)
    @GeneratedValue(generator = "question_category_id_questioncategory_seq")
    @Column(name = "id_questioncategory", nullable = false)
    private Long id;*/

    @Column(name = "name_questioncategory", nullable = false, length = 30)
    private String nameQuestionCategory;

    @Column(name = "state_questioncategory", nullable = false, length = 1)
    private String stateQuestioncategory;

}
