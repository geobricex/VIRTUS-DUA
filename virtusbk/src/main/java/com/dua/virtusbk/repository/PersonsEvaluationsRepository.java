package com.dua.virtusbk.repository;

import com.dua.virtusbk.dto.PersonsEvaluationsDto;
import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.PersonsEvaluations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface PersonsEvaluationsRepository extends JpaRepository<PersonsEvaluations, Long> {

//    @Query(value = "select id_person_evaluation, qualification_person_evaluation, timespent_person_evaluation, " +
//            "persons_id_person, evaluations_id_evaluation, " +
//            "trynumber_person_evaluation, datereg_person_evaluation, " +
//            "'[]' as result_evaluation  " +
//            "from persons_evaluations " +
//            "where evaluations_id_evaluation = ?1 and persons_id_person = ?2", nativeQuery = true)//Debería hacerse con un DTO
//    List<PersonsEvaluations> findByEvaluationsIdEvaluationAndPersonsIdPerson(Evaluation id_evaluation, Person id_person);

// List<PersonsEvaluations> findByEvaluationsIdEvaluationAndPersonsIdPerson(Evaluation id_evaluation, Person id_person);

    @Query(value = "select infor from evaluations_review_select(?1, ?2, ?3)", nativeQuery = true)
//Debería hacerse con un DTO
    String findByEvaluationsIdEvaluationAndPersonsIdPerson(int type, Long id_evaluation, Long id_person);

    List<PersonsEvaluations> findByPersonsIdPersonAndEvaluationsIdEvaluation(Person person, Evaluation evaluation);

}
