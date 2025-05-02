package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query(value = "SELECT information FROM question_select(?1,?2)", nativeQuery = true)
    String findByIdQuestion(Long param, int id_person);

    @Query(value = "SELECT * FROM questions WHERE evaluations_id_evaluation = ?1", nativeQuery = true)
    List<Map<String, Object>> findByEvaluationsIdEvaluation(Long param);
}
