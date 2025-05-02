package com.dua.virtusbk.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Table(name = "utils")
@Entity
@Data
@NoArgsConstructor
@ToString
public class Util {
    @Id
    //@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "key_util", nullable = false, length = 50)
    private String id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "value_util", nullable = false)
    private String valueUtil;

}
