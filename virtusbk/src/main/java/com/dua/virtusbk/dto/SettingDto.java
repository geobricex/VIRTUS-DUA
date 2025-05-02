package com.dua.virtusbk.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SettingDto implements Serializable {
    private final Long id;
    private final LocalDateTime dateregSetting;
    private final LocalDateTime dateupdateSetting;
    private final String settingConfiguration;
}
