package com.dua.virtusbk.controller;


import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Setting;
import com.dua.virtusbk.entity.Util;
import com.dua.virtusbk.repository.SettingRepository;
import com.dua.virtusbk.repository.UtilRepository;
import com.dua.virtusbk.service.SettingService;
import com.dua.virtusbk.service.UtilService;
import com.dua.virtusbk.util.Methods;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/settings")
public class SettingApis {

    @Autowired
    private SettingRepository settingDAO;

    @Autowired
    private SettingService settingService;

    //@RequestMapping(value = "", method = RequestMethod.GET)
    @GetMapping
    public ResponseEntity<List<Setting>> getSetting() {
        List<Setting> listSettings = settingDAO.findAll();
        return ResponseEntity.ok(listSettings);
    }

    @PostMapping("/insertservice")
    public ResponseEntity<String> insertService(@RequestBody @Validated String setting, @RequestHeader("token") String sessionToken) {
        System.out.println("insertservice...");
        System.out.println(setting);
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);

        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(setting);
            String setting_configuration = Methods.JsonToString(jso, "setting_configuration", "");
            res = settingService.saveSetting(setting_configuration, clains[0]);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
            if (res[0].equals("2")) {
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/updateservice")
    public ResponseEntity<String> updateService(@RequestBody @Validated Setting setting, @RequestHeader("token") String sessionToken) {
        System.out.println("updateService...");
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = settingService.updateSetting(setting);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
            if (res[0].equals("2")) {
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/getserviceforperson")
    public ResponseEntity<String> getServiceForPerson(@RequestHeader("token") String sessionToken) {
        System.out.println("getServiceForPerson...");
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {

            res = settingService.getSettingForPerson(clains[0]);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
            if (res[0].equals("2") || res[0].equals("3")) {
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }

        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }
}
