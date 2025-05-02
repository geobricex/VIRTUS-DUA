package com.dua.virtusbk.info;

import java.time.LocalDateTime;

public interface SettingInfo {
    Long getId();

    LocalDateTime getDateregSetting();

    LocalDateTime getDateupdateSetting();

    String getSettingConfiguration();
}
