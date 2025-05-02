package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Syllabu;
import com.dua.virtusbk.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    @Query(value = "SELECT DISTINCT(id_topic), name_topic, description_topic, keywords_topic, pathimg_topic, datereg_topic, dateupdate_topic, state_topic, syllabus_id_syllabu " +
            ",count(e.topics_id_topic) as cantEvaluation " +
            "FROM topics " +
            "LEFT JOIN  evaluations e on topics.id_topic = e.topics_id_topic " +
            "WHERE state_topic = 'A' and syllabus_id_syllabu=?1 " +
            "GROUP BY id_topic " +
            "ORDER BY id_topic asc", nativeQuery = true)
    List<Map<String, Object>> findByIdTopicList(Long param);

    @Query(value = "SELECT * FROM topics where id_topic =?1", nativeQuery = true)
    List<Map<String, Object>>  findIdTopic(Long param);
}
