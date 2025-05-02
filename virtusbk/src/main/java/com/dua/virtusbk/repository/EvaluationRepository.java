package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Syllabu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.Map;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
//    @Query(value = "SELECT id_evaluation, " +
//            "       name_evaluation, " +
//            "       description_evaluation, " +
//            "       datereg_evaluation, " +
//            "       dateupdate_evaluation, " +
//            "       time_evaluation, " +
//            "       timeminutes_evaluation, " +
//            "       topics_id_topic, " +
//            "       state_evaluation, " +
//            "       type_evaluation, " +
//            "       opportunity_evaluation, " +
//            "       opportunities_evaluation, " +
//            "       order_category, " +
//            "       allows_review, " +
//            "       sum(eqc.number_question) as numberquestion_evaluation " +
//            "FROM evaluations " +
//            "         INNER JOIN evaluation_question_category eqc on evaluations.id_evaluation = eqc.evaluations_id_evaluation " +
//            "WHERE topics_id_topic=?1 AND state_evaluation = 'A'" +
//            "GROUP BY id_evaluation " +
//            "ORDER BY  id_evaluation asc", nativeQuery = true)
//    List<Evaluation> findIdTopicEvaluationList(Long param);
    @Query(value = "select information from evaluation_select(?1,?2)", nativeQuery = true)
   String  findIdTopicEvaluationList(int id_evaluation, int id_person);
    @Query(value = "SELECT * FROM evaluations where id_evaluation =?1 order by  id_evaluation asc", nativeQuery = true)
    List<Map<String, Object>> findIdEvaluation(Long param);

    @Query(value = "SELECT information FROM questions_select(?1,?2)", nativeQuery = true)
    String returnEvaluation(int id_evaluation, int id_person);

    @Query(value = "SELECT information FROM questions_all_select(?1,?2)", nativeQuery = true)
    String returnAllEvaluation(int id_evaluation, int id_person);
}
