package com.dua.virtusbk.controller;


import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.service.UtilService;
import com.dua.virtusbk.entity.Util;
import com.dua.virtusbk.repository.UtilRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/utils")
public class UtilApis {

    @Autowired
    private UtilRepository utilDAO;
    @Autowired
    private UtilService utilService;

    //@RequestMapping(value = "", method = RequestMethod.GET)
    @GetMapping
    public ResponseEntity<List<Util>> getUtils() {
        List<Util> listUtils = utilDAO.findAll();
        return ResponseEntity.ok(listUtils);
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<Util> getUtils(@PathVariable("id") String id_util) {
        Optional<Util> findUtil = utilDAO.findById(id_util);
        if (findUtil.isPresent()) {
            return ResponseEntity.ok(findUtil.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/countvisit")
    public ResponseEntity<String> getCountVisit() {
        String status, message = "No se puedo obtener la información", data;
        List<Map<String, Object>> findCount = utilDAO.returnCountVisit();
        Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();

        if (findCount.size() > 0) {
            status = "2";
            message = "Información obetnida con éxito.";
            data = gson.toJson(findCount);
            message = Methods.getJsonMessage(status, message, data);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping
    public ResponseEntity<Util> insertUtil(@RequestBody Util util) {
        Util newUtil = utilDAO.save(util);
        return ResponseEntity.ok(newUtil);
    }

    @PutMapping
    public ResponseEntity<Util> updateUtil(@RequestBody Util util) {
        Util upUtil = utilDAO.save(util);
        if (upUtil != null) {
            return ResponseEntity.ok(upUtil);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "{id}")
    public ResponseEntity<Util> deleteUtil(@PathVariable("id") String id_util) {
        utilDAO.deleteById(id_util);
        return ResponseEntity.ok(null);
    }

    @PostMapping("/gethomeinformation")
    public ResponseEntity<String> gethome(@RequestBody @Validated String data, @RequestHeader("token") String sessionToken) {
        String message;
//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "0");
        System.out.println("gethomeinformation()");
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            JsonObject jso = Methods.stringToJSON(data);
            if (jso.size() > 0) {
                int id_type = Methods.JsonToInteger(jso, "id_type", 0);

                res = utilService.getInformationHome(id_type, clains[0]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
                if (res[0].equals("2")) {
                    return new ResponseEntity<>(message, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
                }
            } else {
                message = Methods.getJsonMessage("4", "Parametros de entrada vacios.", "[]");
                return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
            }
        } else {
            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
                    + "e intentalo de nuevo.", "[]");
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }
    }
}
