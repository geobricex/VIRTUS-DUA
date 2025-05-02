/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import com.dua.virtusbk.reports.ReportCertificateCours;
import com.dua.virtusbk.reports.TypeReport;
import com.dua.virtusbk.dto.reportCertDto;
import com.dua.virtusbk.service.CourseService;
import com.dua.virtusbk.entity.Course;
import com.dua.virtusbk.repository.CourseRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.JsonObject;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author Geovanny Brito.
 */
@RestController
@RequestMapping("/course")
public class CourseApi {
    @Autowired
    private CourseRepository courseDAO;
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getCourse() {
        List<Course> list = courseDAO.findAllByOrderByIdDesc();
        return ResponseEntity.ok(list);
    }

    @GetMapping(path = "/getCourseData")
    public ResponseEntity<Course> getCourse(@RequestParam(name = "id") Long id_course) {
        Optional<Course> courseOptional = courseDAO.findById(id_course);
        if (courseOptional.isPresent()) {
            return ResponseEntity.ok(courseOptional.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping(path = "getcoursestatus")
    public ResponseEntity<List<Course>> getCourseStatus(@RequestParam(name = "status_course") String status_course) {
        List<Course> list = courseDAO.findAllByStateCourseOrdOrderByIdDesc(status_course);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/insertcourse")
    public ResponseEntity<String> insertCourse(@RequestBody @Validated Course course, @RequestHeader("token") String sessionToken) {
        String message;
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = courseService.saveCourse(course, clains[0]);
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

    @PostMapping("/updatecourse")
    public ResponseEntity<String> updateCourse(@RequestBody @Validated Course course, @RequestHeader("token") String sessionToken) {
        String message = "[]";
        String[] clains = Methods.getDataToJwt(sessionToken);
        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
        if (res[0].equals("2")) {
            res = courseService.updateCourse(course, clains[0]);
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

    @PostMapping("/selectcoursesyllabutopic")
    public ResponseEntity<String> selectCourseSyllabuTopic(@RequestBody String data) {//, @RequestHeader("token") String sessionToken) {
        String message = "[]";

//        JsonObject jso = Methods.stringToJSON(data);
//        String sessionToken = Methods.JsonToString(jso, "sessionToken", "");
//
//        String[] clains = Methods.getDataToJwt(sessionToken);
//        String[] res = Methods.validatePermit(clains[0], clains[1], 1);
//        if (res[0].equals("2")) {
        JsonObject jso = Methods.stringToJSON(data);
        String id_course = Methods.JsonToString(jso, "id_course", "");
        String[] res = courseService.selectCourseSyllabuTopic(id_course);
        message = Methods.getJsonMessage(res[0], res[1], res[2]);
        if (res[0].equals("2") || res[0].equals("3")) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(message, HttpStatus.BAD_GATEWAY);
        }
//        } else {
//            message = Methods.getJsonMessage("4", "Credenciales de sesión inválidas, vuelve a iniciar sesión "
//                    + "e intentalo de nuevo.", "[]");
//            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
//        }
    }

    @Autowired
    private ReportCertificateCours reportCertificateCours;

    @GetMapping(path = "/certificate/download")
    public ResponseEntity<InputStreamResource> download(@RequestParam Map<String, Object> params)
            throws JRException, IOException, SQLException {
        System.out.println(params);

        reportCertDto dto = reportCertificateCours.getReport(params);

        InputStreamResource streamResource = new InputStreamResource(dto.getStream());
        MediaType mediaType = null;
        if (params.get("type").toString().equalsIgnoreCase(TypeReport.EXCEL.name())) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        } else {
            mediaType = MediaType.APPLICATION_PDF;
        }

        return ResponseEntity.ok().header("Content-Disposition", "inline; filename=\"" + dto.getFileName() + "\"")
                .contentLength(dto.getLength()).contentType(mediaType).body(streamResource);
    }


}
