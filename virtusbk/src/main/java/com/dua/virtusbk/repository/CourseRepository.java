package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Course;
import com.dua.virtusbk.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    public List<Course> findAllByOrderByIdDesc();

    @Query(value = "select * from courses "+
    "where state_course = ?1 order by id_course desc", nativeQuery = true)
    public List<Course> findAllByStateCourseOrdOrderByIdDesc(String param);
}
