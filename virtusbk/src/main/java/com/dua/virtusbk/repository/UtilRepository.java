package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.Util;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.swing.table.DefaultTableModel;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UtilRepository extends JpaRepository<Util, String> {
    @Query(value = "select * from public.utils", nativeQuery = true)
    List<Util> returnUtilsData();

    Optional<Util> findByValueUtil(String splantilla);

    Optional<Util> findById(String id);

    @Query(value = "select * from count_visit()", nativeQuery = true)
    List<Map<String, Object>>  returnCountVisit();

    @Query(value = "select infor from home_select(?1,?2)", nativeQuery = true)
    String returnInformationHome(int type, int param);

}
