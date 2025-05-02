package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.Setting;
import com.dua.virtusbk.entity.Util;
import com.dua.virtusbk.repository.SettingRepository;
import com.dua.virtusbk.repository.UtilRepository;
import com.dua.virtusbk.util.DataStatic;
import com.dua.virtusbk.util.Email;
import com.dua.virtusbk.util.Methods;
import com.dua.virtusbk.util.WeEncoder;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@Transactional
public class SettingService {

    @Autowired
    private SettingRepository settingDAO;

    public String[] saveSetting(String setting_configuration, String idPerson) {
        System.out.println("saveEvaluation");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        Setting setting = new Setting();

        setting.setDateregSetting(Methods.nowLocalDateTime());
        setting.setDateupdateSetting(Methods.nowLocalDateTime());
        setting.setPersonsIdPerson(new Person(Long.parseLong(idPerson)));
        setting.setSettingConfiguration(setting_configuration);
        System.out.println(setting);
        setting = settingDAO.save(setting);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id_setting", setting.getId());
        status = "2";
        message = "Configuración registrada con éxito.";
        data = jsonObject.toString();

        return new String[]{status, message, data};
    }

    public String[] updateSetting(Setting setting) {
        System.out.println("saveEvaluation");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        setting.setDateupdateSetting(Methods.nowLocalDateTime());

        System.out.println(setting);
        setting = settingDAO.save(setting);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id_setting", setting.getId());
        status = "2";
        message = "Configuración registrada con éxito.";
        data = jsonObject.toString();

        return new String[]{status, message, data};
    }

    public String[] getSettingForPerson(String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> settings = settingDAO.findByPersonsIdPersonOrderByDateregSettingDesc(Long.parseLong(id_person));
//        List<Map<String, Object>> settings = settingDAO.findCostmeticSettingByPersonId(Long.parseLong(id_person));

        if (settings.size() > 0) {
            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            data = gson.toJson(settings);
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }
        return new String[]{status, message, data};
    }

}
