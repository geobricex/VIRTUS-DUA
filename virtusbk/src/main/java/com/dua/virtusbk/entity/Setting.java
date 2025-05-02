package com.dua.virtusbk.entity;

import com.dua.virtusbk.entity.Person;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @SequenceGenerator(name = "settings_id_setting_seq", sequenceName = "settings_id_setting_seq", allocationSize = 1)
    @GeneratedValue(generator = "settings_id_setting_seq")
    @Column(name = "id_setting", nullable = false)
    private Long id;

    @Column(name = "datereg_setting", nullable = false)
    private LocalDateTime dateregSetting;

    @Column(name = "dateupdate_setting", nullable = false)
    private LocalDateTime dateupdateSetting;

    @Column(name = "setting_configuration", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String settingConfiguration;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "persons_id_person", nullable = false)
//    @JsonIgnore// No traer toda la relación en una consulta
    private Person personsIdPerson;

}
