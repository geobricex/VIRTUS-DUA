package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.PersonsCours;
import com.dua.virtusbk.entity.Syllabu;
import org.json.JSONObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface PersonsCourseRepository extends JpaRepository<PersonsCours, Long> {

    @Query(value = "SELECT pc.id_person_course, pc.datereg_person_course,\n" +
            "    c.id_course, c.description_course, c.name_course, c.pathimg_course,\n" +
            "    c.dateupdate_course, c.language_course, c.keywords_course, c.price_course\n" +
            "    FROM persons_courses as pc\n" +
            "    INNER JOIN courses c on pc.courses_id_course = c.id_course\n" +
            "    INNER JOIN persons p on c.persons_id_person = p.id_person\n" +
            "    WHERE pc.persons_id_person = ?1 \n" +
            "    AND state_course = ?2 AND state_person_course = 'A'", nativeQuery = true)
    List<Map<String, Object>> findByPersonCourse(Long persons_id_person, String state_course_person);

    @Query(value = " SELECT * FROM person_course_select(?1,?2)", nativeQuery = true)
    String findByPersonCourseF(Long persons_id_person, String state_course_person);

    @Query(value = " SELECT * FROM public.allcoursenojoin_select(?1,'?2')", nativeQuery = true)
    String finAllCourseNoJoin(Long persons_id_person, String state_course_person);

    @Query(value = " SELECT * FROM public.course_syllabu_topic_select(?1)", nativeQuery = true)
    String finSelectCourseSyllabuTopic(Long id_course);
}
