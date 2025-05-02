/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.service.ResourceService;
import com.dua.virtusbk.entity.Resource;
import com.dua.virtusbk.repository.ResourceRepository;
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
@RequestMapping("/resource")
public class ResourceApi {
    @Autowired
    private ResourceRepository resourceDAO;

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getResource() {
        List<Resource> list = resourceDAO.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertresource")
    public ResponseEntity<String> insertResource(@RequestBody @Validated Resource resource, @RequestHeader("token") String sessionToken) {
        System.out.println("insertresource...");
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = resourceService.saveResource(resource);
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

    @PostMapping("/updateresource")
    public ResponseEntity<String> updateResource(@RequestBody @Validated Resource resource, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = resourceService.updateResource(resource);
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

    @PostMapping("/delateresource")
    public ResponseEntity<String> delateResource(@RequestBody Resource resource, @RequestHeader("token") String sessionToken) {
        System.out.println(resource);
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = resourceService.delateResource(resource);
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

    @PostMapping("/getresources")
    public ResponseEntity<String> getResources(@RequestBody @Validated String id_topic) {//, @RequestHeader("token") String sessionToken) {
        System.out.println("getResources...");
        String message = "";
//        JsonObject jso = Methods.stringToJSON(token);
//        String sToken = Methods.JsonToString(jso, "token", "");
//        String[] clains = Methods.getDataToJwt(sToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(id_topic);
        String topic_id_resources = Methods.JsonToString(jso, "topic_id_resources", "");
        if (!topic_id_resources.equals("")) {
            String[] res = resourceService.getResources(topic_id_resources);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
            if (res[0].equals("2") || res[0].equals("3")) {
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
        }
//        } else {
//            return ResponseEntity.noContent().build();
//        }
    }

    @PostMapping("/getresource")
    public ResponseEntity<String> getResource(@RequestBody @Validated String id_resources) {//, @RequestHeader("token") String sessionToken) {
        System.out.println("getResource...");
        String message;
//        JsonObject jso = Methods.stringToJSON(token);
//        String sToken = Methods.JsonToString(jso, "token", "");
//        String[] clains = Methods.getDataToJwt(sToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(id_resources);
        String id_resource = Methods.JsonToString(jso, "id_resource", "");
        String[] res = resourceService.getResource(id_resource);
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
