/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.entity.*;
import com.dua.virtusbk.repository.AnswerRepository;
import com.dua.virtusbk.repository.PersonsEvaluationsRepository;
import com.dua.virtusbk.service.AnswerService;
import com.dua.virtusbk.service.PersonsEvaluationsService;
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
@RequestMapping("/personsevaluations")
public class PersonsEvaluationsApi {
    @Autowired
    private PersonsEvaluationsRepository personsEvaluationsDAO;

    @Autowired
    private PersonsEvaluationsService personsEvaluationsService;

    @GetMapping
    public ResponseEntity<List<PersonsEvaluations>> getPersonsEvaluations() {
        List<PersonsEvaluations> list = personsEvaluationsDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping(path = "getpersonsevaluations")
    public ResponseEntity<String> getPersonsEvaluations(@RequestParam(name = "type") int type, @RequestParam(name = "id_evaluation") Long id_evaluation, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            System.out.println("getPersonsevaluations");
            res = personsEvaluationsService.getPersonsEvaluations(type, id_evaluation, Long.parseLong(clains[0]));
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/insertpersonsevaluations")
    public ResponseEntity<String> insertPersonsEvaluations(@RequestBody @Validated String personsEvaluations, @RequestHeader("token") String sessionToken) {
        System.out.println("insertpersonsevaluations...");
        System.out.println(personsEvaluations);
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(personsEvaluations);
            String result_evaluation = Methods.JsonToString(jso, "result_evaluation", "");
            String qualification_person_evaluation = Methods.JsonToString(jso, "qualification_person_evaluation", "0.0");
            String timespent_person_evaluation = Methods.JsonToString(jso, "timespent_person_evaluation", "0.0");
            String evaluations_id_evaluation = Methods.JsonToString(jso, "evaluations_id_evaluation", "");

            res = personsEvaluationsService.savePersonsEvaluations(result_evaluation, qualification_person_evaluation,
                    timespent_person_evaluation, evaluations_id_evaluation, clains[0]);
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

    @PostMapping("/updatepersonsevaluations")
    public ResponseEntity<String> updatePersonsEvaluations(@RequestBody @Validated PersonsEvaluations personsEvaluations, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = personsEvaluationsService.updatePersonsEvaluations(personsEvaluations);
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

}
