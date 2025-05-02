package com.dua.virtusbk.repository;

import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.Map;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    @Query(value = "SELECT * FROM resources where topics_id_topic =?1 AND state_resource = 'A' " +
            "order by id_resource asc ", nativeQuery = true)
    List<Resource> findIdTopicResourceList(Long param);

    @Query(value = "SELECT * FROM resources where topics_id_topic =?1 AND state_resource = 'A' " +
            "order by id_resource asc ", nativeQuery = true)
    List<Map<String, Object>> findIdTopicResourceList2(Long param);

    //    @Query(value = "SELECT * FROM resources where topics_id_topic =?1 order by id_resource asc ", nativeQuery = true)
//   String findIdTopicResourceList3(Long param);
    @Query(value = "SELECT * FROM resources where id_resource =?1", nativeQuery = true)
    List<Map<String, Object>> findIdResource(Long param);
}
