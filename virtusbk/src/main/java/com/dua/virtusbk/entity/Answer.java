package com.dua.virtusbk.entity;

import com.dua.virtusbk.entity.Question;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.springframework.data.jpa.domain.AbstractPersistable;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Table(name = "answers")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Answer {
    public Answer(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_answer", unique = true, nullable = false)
    private Long id;

    /*@Id
    @SequenceGenerator(name = "answers_id_answer_seq", sequenceName = "answers_id_answer_seq", allocationSize = 1)
    @GeneratedValue(generator = "answers_id_answer_seq")
    @Column(name = "id_answer", nullable = false)
    private Long id;*/

    @Column(name = "options_answer", nullable = false, length = 8000)
    private String optionsAnswer;

    @Column(name = "datereg_answer", nullable = false)
    private LocalDateTime dateregAnswer;

    @Column(name = "dateupdate_answer", nullable = false)
    private LocalDateTime dateupdateAnswer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "questions_id_question", nullable = false)
    //@JsonIgnore// No traer toda la relación en una consulta
    private Question questionsIdQuestion;

}
