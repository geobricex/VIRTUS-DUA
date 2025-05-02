/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.EvaluationService;
import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.repository.EvaluationRepository;
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
@RequestMapping("/evaluation")
public class EvaluationApi {
    @Autowired
    private EvaluationRepository evaluationDAO;

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping
    public ResponseEntity<List<Evaluation>> getEvaluation() {
        List<Evaluation> list = evaluationDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertevaluation")
    public ResponseEntity<String> insertEvaluation(@RequestBody @Validated Evaluation evaluation, @RequestHeader("token") String sessionToken) {
        System.out.println("insertevaluation...");
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = evaluationService.saveEvaluation(evaluation);
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

    @PostMapping("/updateevaluation")
    public ResponseEntity<String> updateEvaluation(@RequestBody @Validated Evaluation evaluation, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = evaluationService.updateEvaluation(evaluation);
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

    @PostMapping("/deleteevaluation")
    public ResponseEntity<String> deleteEvaluation(@RequestBody @Validated Evaluation evaluation, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = evaluationService.deleteEvaluation(evaluation);
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

    @PostMapping("/getevaluations")
    public ResponseEntity<String> getEvaluations(@RequestBody @Validated String id_topic, @RequestHeader("token") String sessionToken) {
        System.out.println("getevaluations...");
        String message = "";
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(id_topic);
            String topic_id_evaluation = Methods.JsonToString(jso, "topic_id_evaluation", "");
            if (!topic_id_evaluation.equals("")) {
                res = evaluationService.getEvaluations(topic_id_evaluation, clains[0]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
                if (res[0].equals("2") || res[0].equals("3")) {
                    return new ResponseEntity<>(message, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
                }
            } else {
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/getevaluation")
    public ResponseEntity<String> getEvaluation(@RequestBody @Validated String id_evaluations) {//, @RequestHeader("token") String sessionToken) {
        System.out.println("getevaluation...");
        String message;
//        JsonObject jso = Methods.stringToJSON(token);
//        String sToken = Methods.JsonToString(jso, "token", "");
//        String[] clains = Methods.getDataToJwt(sToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(id_evaluations);
        String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
        String[] res = evaluationService.getEvaluation(id_evaluation);
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

    @PostMapping("/getEvaluationQuestions")
    public ResponseEntity<String> getEvaluationQuestions(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        System.out.print("getEvaluationQuestions...");
        String message;
        /*TEMPORAL*/
//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");
        /*FIN TEMPORAL*/
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            if (jso.size() > 0) {
                String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
                System.out.println(id_evaluation);
                res = evaluationService.getEvaluationQuestions(id_evaluation, clains[0]);
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

    @PostMapping("/getAllEvaluationQuestions")
    public ResponseEntity<String> getAllEvaluationQuestions(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        System.out.print("getEvaluationQuestions...");
        String message;
        /*TEMPORAL*/
//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");
        /*FIN TEMPORAL*/
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            if (jso.size() > 0) {
                String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
                System.out.println(id_evaluation);
                res = evaluationService.getAllEvaluationQuestions(id_evaluation, clains[0]);
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

    @PostMapping("/updateQuantityQuestions")
    public ResponseEntity<String> updateQuantityQuestions(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.println(data);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            String quantity_question = Methods.JsonToString(jso, "quantity_question", "0");
            String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
            String id_question_category = Methods.JsonToString(jso, "id_question_category", "");
            res = evaluationService.updateQuantityQuestions(quantity_question, id_evaluation, id_question_category);
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

    @PostMapping("/selectQuantityQuestions")
    public ResponseEntity<String> selectQuantityQuestions(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        System.out.println(data);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            String id_evaluation = Methods.JsonToString(jso, "id_evaluation", "");
            res = evaluationService.selectQuantityQuestions(id_evaluation);
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
