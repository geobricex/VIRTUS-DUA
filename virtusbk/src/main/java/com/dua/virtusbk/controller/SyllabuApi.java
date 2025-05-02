/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.SyllabuService;
import com.dua.virtusbk.entity.Syllabu;
import com.dua.virtusbk.repository.SyllabuRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Geovanny Brito.
 */
@RestController
@RequestMapping("/syllabu")
public class SyllabuApi {
    @Autowired
    private SyllabuRepository syllabuDAO;

    @Autowired
    private SyllabuService syllabuService;

    @GetMapping
    public ResponseEntity<List<Syllabu>> getSyllabu() {
        List<Syllabu> list = syllabuDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertsyllabu")
    public ResponseEntity<String> insertSyllabu(@RequestBody @Validated Syllabu syllabu, @RequestHeader("token") String sessionToken) {
        System.out.println("insertsyllabu");
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);

        if (res[0].equals("2")) {
            res = syllabuService.saveSyllabu(syllabu);
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

    @PostMapping("/updatesyllabu")
    public ResponseEntity<String> updateSyllabu(@RequestBody @Validated Syllabu syllabu, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.println(syllabu);
        if (res[0].equals("2")) {
            res = syllabuService.updateSyllabu(syllabu);
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

    @GetMapping(value = "{id}")
    public ResponseEntity<String> get_Syllabu(@PathVariable("token") String sessionToken) {
        System.out.println("getSyllabu...");
        String message;
        JsonObject jso = Methods.stringToJSON(sessionToken);
        String sToken = Methods.JsonToString(jso, "sessionToken", "");
        String[] clains = Methods.getDataToJwt(sToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        message = Methods.getJsonMessage(res[0], res[1], res[2]);

        if (res[0].equals("2") || res[0].equals("3")) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping("/getsyllabus")
    public ResponseEntity<String> getSyllabus(@RequestBody String id_course) {
        System.out.println("getSyllabus...");
        String message;
//        JsonObject jso = Methods.stringToJSON(sessionToken);
//        String sToken = Methods.JsonToString(jso, "sessionToken", "");
//        String[] clains = Methods.getDataToJwt(sToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(id_course);
        String course_id_syllabu = Methods.JsonToString(jso, "course_id_syllabu", "");
        String[] res = syllabuService.getSyllabus(course_id_syllabu);
        message = Methods.getJsonMessage(res[0], res[1], res[2]);
        if (res[0].equals("2") || res[0].equals("3")) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
//        } else {
//            return ResponseEntity.noContent().build();
//        }
    }

    @PostMapping("/getsyllabu")
    public ResponseEntity<String> getSyllabu(@RequestBody String id_syllabus) {
        System.out.println("getSyllabu...");
        String message;
//        JsonObject jso = Methods.stringToJSON(sessionToken);
//        String sToken = Methods.JsonToString(jso, "sessionToken", "");
//        String[] clains = Methods.getDataToJwt(sToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(id_syllabus);
        String id_syllabu = Methods.JsonToString(jso, "id_syllabu", "");
        String[] res = syllabuService.getSyllabu(id_syllabu);
        message = Methods.getJsonMessage(res[0], res[1], res[2]);
        if (res[0].equals("2") || res[0].equals("3")) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
//        } else {
//            return ResponseEntity.noContent().build();
//        }
    }

}
