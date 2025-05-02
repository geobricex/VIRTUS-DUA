package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.entity.Topic;
import com.dua.virtusbk.repository.TopicRepository;
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
public class TopicService {
    @Autowired
    private TopicRepository topicDAO;

    public String[] saveTopic(Topic topic) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        System.out.println(topic);
        if (Methods.verifyMaxLength(topic.getDescriptionTopic(), 500)
                && Methods.verifyMaxLength(topic.getNameTopic(), 100)) {
            if (Methods.verifyMaxLength(topic.getPathimgTopic(), 250)) {
                topic.setDateregTopic(Methods.nowLocalDateTime());
                topic.setDateupdateTopic(Methods.nowLocalDateTime());
                topic.setStateTopic("A");
                topic = topicDAO.save(topic);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_topic", topic.getId());
                status = "2";
                message = "Tema registrado con éxito.";
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

    public String[] updateTopic(Topic topic) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(topic.getDescriptionTopic(), 500)
                && Methods.verifyMaxLength(topic.getNameTopic(), 100)) {
            if (Methods.verifyMaxLength(topic.getPathimgTopic(), 250)) {
                topic.setDateupdateTopic(Methods.nowLocalDateTime());
                topic = topicDAO.save(topic);
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_topic", topic.getId());
                status = "2";
                message = "Tema actualizado con éxito.";
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

    public String[] getTopics(String id_syllabu) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> topics = topicDAO.findByIdTopicList(Long.parseLong(id_syllabu));
        if (topics.size() > 0) {
//            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
//            data = gson.toJson(topics).toString();
            JSONArray jsonArray = new JSONArray(topics);
            data = jsonArray.toString();
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println("getTopics=" + data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }

        return new String[]{status, message, data};
    }

    public String[] getTopic(String id_topic) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> topics = topicDAO.findIdTopic(Long.parseLong(id_topic));
        if (topics.size() > 0) {
            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            data = gson.toJson(topics);
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }

        return new String[]{status, message, data};
    }

}
