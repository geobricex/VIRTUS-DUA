package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.Util;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.swing.table.DefaultTableModel;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {

    @Query(value = "select per.* from persons as per where per.email_person=?1", nativeQuery = true)
    Person findByEmail(String param);


    @Query(value = "select * " +
           // "per.id_person, per.name_person, per.lastname_person, per.email_person, per.password_person, per.pathimg_person, per.type_person, per.provider_person " +
            "from persons as per " +
            "where per.email_person=?1", nativeQuery = true)
    List<Person> findByEmailList(String param);

    Optional<Person> findById(Long id);

    List<Person> findByIdNotOrderByDateregPerson(Long id);

//    List<Map<String, Object>> findByIdNotOrderByDateregPerson(Long id);
}
