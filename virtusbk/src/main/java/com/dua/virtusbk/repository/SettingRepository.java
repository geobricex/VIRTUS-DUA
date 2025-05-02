package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.Setting;
import org.hibernate.annotations.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface SettingRepository extends JpaRepository<Setting, Long> {
    @Query(value = "SELECT " +
            "id_setting as \"id\", datereg_setting as \"dateregSetting\", \n" +
            "dateupdate_setting as \"dateupdateSetting\",\n" +
            "setting_configuration as \"settingConfiguration\",\n" +
            "persons_id_person as \"personsIdPerson\"" +
            " FROM settings WHERE  persons_id_person = ?1 ORDER BY id_setting DESC LIMIT 1", nativeQuery = true)
    List<Map<String, Object>>  findByPersonsIdPersonOrderByDateregSettingDesc(Long person_id);

    @Query(value = "SELECT st FROM Setting st WHERE st.personsIdPerson.id = ?1 ORDER BY st.dateregSetting DESC ")
    List<Map<String, Object>>  findCostmeticSettingByPersonId(Long person_id);
}
