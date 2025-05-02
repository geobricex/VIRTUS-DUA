/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.AnswerService;
import com.dua.virtusbk.entity.Answer;
import com.dua.virtusbk.repository.AnswerRepository;
import com.dua.virtusbk.util.Methods;
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
@RequestMapping("/answer")
public class AnswerApi {
    @Autowired
    private AnswerRepository answerDAO;

    @Autowired
    private AnswerService answerService;

    @GetMapping
    public ResponseEntity<List<Answer>> getAnswer() {
        List<Answer> list = answerDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertanswer")
    public ResponseEntity<String> insertAnswer(@RequestBody @Validated Answer answer, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.printf(answer.toString());
        if (res[0].equals("2")) {
            res = answerService.saveAnswers(answer);
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

    @PostMapping("/updateanswer")
    public ResponseEntity<String> updateAnswer(@RequestBody @Validated Answer answer, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = answerService.updateAnswers(answer);
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
