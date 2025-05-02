/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.AnswerService;
import com.dua.virtusbk.service.QuestionService;
import com.dua.virtusbk.entity.Question;
import com.dua.virtusbk.repository.QuestionRepository;
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
@RequestMapping("/question")
public class QuestionApi {
    @Autowired
    private QuestionRepository questionDAO;

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getQuestion() {
        List<Question> list = questionDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertquestion")
    public ResponseEntity<String> insertQuestion(@RequestBody @Validated Question question, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.println(clains[0] + " - " + clains[1]);
        System.out.println(question.toString());
        if (res[0].equals("2")) {
            res = questionService.saveQuestion(question);
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

    @PostMapping("/updatequestion")
    public ResponseEntity<String> updateQuestion(@RequestBody @Validated Question question, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = questionService.updateQuestion(question);
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

    @PostMapping("/getQuestions")
    public ResponseEntity<String> getQuestions(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        System.out.println("getQuestions...");
        String message;
//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            if (jso.size() > 0) {
                String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
                res = questionService.getQuestions(id_evaluation);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
                if (res[0].equals("2") || res[0].equals("3")) {
                    return new ResponseEntity<>(message, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
                }
            } else {
                message = Methods.getJsonMessage("4", "Parametros de entrada no válidos.", "[]");
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/getQuestion")
    public ResponseEntity<String> getQuestion(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        System.out.println("getQuestion...");
        String message;
//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.println(data);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            if (jso.size() > 0) {
                String id_question = Methods.JsonToString(jso, "id_question", "");
                res = questionService.getQuestion(id_question, clains[0]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
                if (res[0].equals("2") || res[0].equals("3")) {
                    return new ResponseEntity<>(message, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
                }
            } else {
                message = Methods.getJsonMessage("4", "Parametros de entrada no válidos.", "[]");
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }
}
