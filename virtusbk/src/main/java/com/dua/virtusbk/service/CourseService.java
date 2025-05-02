package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.reports.JasperReportManager;
import com.dua.virtusbk.reports.ReportCertificateCours;
import com.dua.virtusbk.reports.TypeReport;
import com.dua.virtusbk.dto.reportCertDto;
import com.dua.virtusbk.entity.Course;
import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.PersonsCours;
import com.dua.virtusbk.repository.CourseRepository;
import com.dua.virtusbk.repository.PersonsCourseRepository;
import com.dua.virtusbk.util.LocalDateTimeAdapter;
import com.dua.virtusbk.util.Methods;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Map;
import javax.sql.DataSource;

@Service
@Transactional
public class CourseService implements ReportCertificateCours {
    @Autowired
    private CourseRepository courseDAO;

    @Autowired
    private PersonsCourseRepository personcourseDAO;

    public String[] saveCourse(Course course, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(course.getDescriptionCourse(), 250) && Methods.verifyMaxLength(course.getNameCourse(), 75)) {
            if (Methods.verifyMaxLength(course.getPathimgCourse(), 400)) {
                course.setPersonsIdPerson(new Person(Long.parseLong(id_person)));
                course.setDateregCourse(Methods.nowLocalDateTime());
                course.setDateupdateCourse(Methods.nowLocalDateTime());
                course.setStateCourse("A");
                course = courseDAO.save(course);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_course", course.getId());
                status = "2";
                message = "Curso registrado con éxito.";
                data = jsonObject.toString();
            } else {
                status = "3";
                message = "Longitud excedida del enlace generado.";
            }
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateCourse(Course course, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        System.out.println("updateCourse");
        if (Methods.verifyMaxLength(course.getDescriptionCourse(), 250) && Methods.verifyMaxLength(course.getNameCourse(), 75)) {
            if (Methods.verifyMaxLength(course.getPathimgCourse(), 400)) {
                course.setDateupdateCourse(Methods.nowLocalDateTime());
                course = courseDAO.save(course);

                status = "2";
                message = "Curso actualizado con éxito.";
                data = "[{\"id_course\":" + course.getId() + "}]";
            } else {
                status = "3";
                message = "Longitud excedida del enlace generado.";
            }
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};
    }

    public String[] joinCourse(String id_course, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        PersonsCours personsCours = new PersonsCours();

        personsCours.setPersonsIdPerson(new Person(Long.parseLong(id_person)));
        personsCours.setCoursesIdCourse(new Course(Long.parseLong(id_course)));

//        Person person = new Person();
//        Course course = new Course();
//        person.setId(Long.parseLong(id_person));
//        course.setId(Long.parseLong(id_course));
//        personsCours.setPersonsIdPerson(person);
//        personsCours.setCoursesIdCourse(course);

        personsCours.setStatePersonCourse("A");
        personsCours.setDateregPersonCourse(Methods.nowLocalDateTime());
        System.out.println();
        personsCours = personcourseDAO.save(personsCours);
//        Gson gson_ = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
//        data = gson_.toJson(personsCours);
//        System.out.println("###1###");
//        System.out.println(data);

        Gson gson = new GsonBuilder().registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()).create();
        System.out.println("###2###");
        data = gson.toJson(personsCours);
        System.out.println(data);
        status = "2";
        message = "Se ha unido al curso correctamente.";

        return new String[]{status, message, data};
    }

    public String[] myCourseJoin(String id_person, String state_course_person) {
        System.out.println("myCourseJoin");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String personsCours = personcourseDAO.findByPersonCourseF(Long.parseLong(id_person), state_course_person);
        JsonArray jso = Methods.stringToJsonArray(personsCours);

        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";
            data = jso.toString();
        } else {
            status = "3";
            message = "No se ha encontrado datos.";
        }

        System.out.println(data);
        return new String[]{status, message, data};
    }

    public String[] allCourseNoJoin(String id_person, String state_course_person) {
        System.out.println("allCourseNoJoin");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String personsCours = personcourseDAO.finAllCourseNoJoin(Long.parseLong(id_person), state_course_person);
        JsonArray jso = Methods.stringToJsonArray(personsCours);
        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";
            data = jso.toString();
        } else {
            status = "3";
            message = "No se ha encontrado datos.";
        }
        System.out.println(data);
        return new String[]{status, message, data};
    }

    public String[] selectCourseSyllabuTopic(String id_course) {
        System.out.println("selectCourseSyllabuTopic");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String personsCours = personcourseDAO.finSelectCourseSyllabuTopic(Long.parseLong(id_course));
        JsonArray jso = Methods.stringToJsonArray(personsCours);
        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";
            data = jso.toString();
        } else {
            status = "3";
            message = "No se ha encontrado datos.";
        }

        System.out.println(data);
        return new String[]{status, message, data};
    }

    @Autowired
    private JasperReportManager reportManager;
    @Autowired
    private DataSource dataSource;

    @Override
    public reportCertDto getReport(Map<String, Object> params) throws JRException, IOException, SQLException {
        String fileName = "virtus_cert";
        reportCertDto dto = new reportCertDto();
        String extension = params.get("type").toString().equalsIgnoreCase(TypeReport.EXCEL.name()) ? ".xlsx" : ".pdf";
        dto.setFileName(fileName + extension);

        ByteArrayOutputStream stream = reportManager.exportReport(fileName, params.get("type").toString(), params, dataSource.getConnection());

        byte[] bs = stream.toByteArray();
        dto.setStream(new ByteArrayInputStream(bs));
        dto.setLength(bs.length);

        return dto;
    }
}
