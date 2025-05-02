package com.dua.virtusbk.dto;

import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Person;
import lombok.Data;

import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.SqlResultSetMapping;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@SqlResultSetMapping(
        name = "persons_evaluations",
        entities = {
                @EntityResult(
                        entityClass = PersonsEvaluationsDto.class, // The name of the class
                        fields = {
                                @FieldResult(name = "id", column = "id_person_evaluation"),
                                @FieldResult(name = "dateregPersonEvaluation", column = "datereg_person_evaluation"),
                                @FieldResult(name = "qualificationPersonEvaluation", column = "qualification_person_evaluation"),
                                @FieldResult(name = "trynumberPersonEvaluation", column = "trynumber_person_evaluation"),
                                @FieldResult(name = "timespentPersonEvaluation", column = "timespent_person_evaluation")
                        }
                )
        }
)
public class PersonsEvaluationsDto implements Serializable {
    private final Long id;
    //private final String resultEvaluation;
    private final LocalDateTime dateregPersonEvaluation;
    private final Double qualificationPersonEvaluation;
    private final Integer trynumberPersonEvaluation;
    private final Double timespentPersonEvaluation;
    //private final Person personsIdPerson;
    //private final Evaluation evaluationsIdEvaluation;
}
