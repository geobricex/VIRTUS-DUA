/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.CourseService;
import com.dua.virtusbk.entity.PersonsCours;
import com.dua.virtusbk.repository.PersonsCourseRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Geovanny Brito.
 */
@RestController
@RequestMapping("/personscours")
public class PersonsCoursApi {
    @Autowired
    private PersonsCourseRepository personscoursDAO;
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<PersonsCours>> getPersonsCours() {
        List<PersonsCours> list = personscoursDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/joincourse")
    public ResponseEntity<String> joinCourse(@RequestBody String data, @RequestHeader("token") String sessionToken) {
        String message = "[]";
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            String id_course = Methods.JsonToString(jso, "id_course", "");
            res = courseService.joinCourse(id_course, clains[0]);
            if (res[0].equals("2") || res[0].equals("3")) {
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                        + "e intentalo de nuevo.", "[]");
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/mycoursejoin")
    public ResponseEntity<String> myCourseJoin(@RequestBody String data, @RequestHeader("token") String sessionToken) {
        String message = "[]";

//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");

        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            String state_course_person = Methods.JsonToString(jso, "state_course_person", "");
            res = courseService.myCourseJoin(clains[0], state_course_person);
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

    @PostMapping("/allcoursenojoin")
    public ResponseEntity<String> allCourseNoJoin(@RequestBody String data, @RequestHeader("token") String sessionToken) {
        String message = "[]";

//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");

        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            String state_course_person = Methods.JsonToString(jso, "state_course_person", "");
            res = courseService.allCourseNoJoin(clains[0], state_course_person);
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
