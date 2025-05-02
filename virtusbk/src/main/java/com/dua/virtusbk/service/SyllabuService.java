package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.entity.Syllabu;
import com.dua.virtusbk.repository.SyllabuRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class SyllabuService {
    @Autowired
    private SyllabuRepository syllabuDAO;

    public String[] saveSyllabu(Syllabu syllabu) {
        System.out.println("saveSyllabu");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(syllabu.getDescriptionSyllabu(), 500)
                && Methods.verifyMaxLength(syllabu.getNameSyllabu(), 100)) {
            if (Methods.verifyMaxLength(syllabu.getPathimgSyllabus(), 250)) {
                System.out.println(syllabu);
                syllabu.setDateregSyllabu(Methods.nowLocalDateTime());
                syllabu.setDateupdateSyllabu(Methods.nowLocalDateTime());
                syllabu.setStateSyllabu("A");
                syllabu = syllabuDAO.save(syllabu);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_syllabu", syllabu.getId());
                status = "2";
                message = "Módulo registrado con éxito.";
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

    public String[] updateSyllabu(Syllabu syllabu) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(syllabu.getDescriptionSyllabu(), 500)
                && Methods.verifyMaxLength(syllabu.getNameSyllabu(), 100)) {
            if (Methods.verifyMaxLength(syllabu.getPathimgSyllabus(), 250)) {
                syllabu.setDateupdateSyllabu(Methods.nowLocalDateTime());
                syllabu = syllabuDAO.save(syllabu);
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_syllabu", syllabu.getId());
                status = "2";
                message = "Módulo actualizado con éxito.";
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

    public String[] getSyllabus(String id_course) {
        System.out.println("getSyllabus");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> syllabus = syllabuDAO.findByIdCourseList(Long.parseLong(id_course));
        if (syllabus.size() > 0) {
//            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
//            data = gson.toJson(syllabus);
            JSONArray jsonArray = new JSONArray(syllabus);
            data = jsonArray.toString();
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "4";
            message = "No se ha encontrado información.";
        }

        return new String[]{status, message, data};
    }

    public String[] getSyllabu(String id_syllabu) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> syllabus = syllabuDAO.findIdSyllabu(Long.parseLong(id_syllabu));
        if (syllabus.size() > 0) {
            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            data = gson.toJson(syllabus);
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }

        return new String[]{status, message, data};
    }

    public JsonObject syllabuToJson(List<Syllabu> syllabus) {

        JsonObject jsonObject = new JsonObject();
//        for (Syllabu syllabu : syllabus) {
//            jsonObject.addProperty("id_syllabu", syllabu.getId().toString());
//            jsonObject.addProperty("name_syllabu", syllabu.getNameSyllabu());
//            jsonObject.addProperty("description_syllabu", syllabu.getDescriptionSyllabu());
//            jsonObject.addProperty("keywords_syllabu", syllabu.getKeywordsSyllabu());
//            jsonObject.addProperty("pathimg_syllabus", syllabu.getPathimgSyllabus());
//            jsonObject.addProperty("datereg_syllabu", syllabu.getDateregSyllabu().toString());
//            jsonObject.addProperty("dateupdate_syllabu", syllabu.getDateupdateSyllabu().toString());
//            jsonObject.addProperty("state_syllabu", syllabu.getStateSyllabu());
//        }
//        System.out.println(jsonObject.toString());
        return jsonObject;
    }
}
