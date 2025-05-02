package com.dua.virtusbk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Table(name = "resources")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Resource {
    @Id
    @SequenceGenerator(name = "resources_id_resource_seq", sequenceName = "resources_id_resource_seq", allocationSize = 1)
    @GeneratedValue(generator = "resources_id_resource_seq")
    @Column(name = "id_resource", nullable = false)
    private Long id;

    @Column(name = "name_resource", nullable = false, length = 50)
    private String nameResource;

    @Column(name = "description_resource", nullable = false, length = 100)
    private String descriptionResource;

    @Column(name = "pathfile_resource", length = 200)
    private String pathfileResource;

    @Column(name = "pathvideo_resource", length = 200)
    private String pathvideoResource;

    @Column(name = "pathurlsign_resource", length = 200)
    private String pathurlsignResource;

    @Column(name = "pathurlremote_resource", length = 200)
    private String pathurlremoteResource;

    @Column(name = "datereg_resource")
    private LocalDateTime dateregResource;

    @Column(name = "dateupdate_resource")
    private LocalDateTime dateupdateResource;

    @Column(name = "state_resource", nullable = false, length = 1)
    private String stateResource;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @Cascade(value={org.hibernate.annotations.CascadeType.ALL})
    @JoinColumn(name = "topics_id_topic", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Topic topicsIdTopic;

}
