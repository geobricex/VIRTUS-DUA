package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.entity.Resource;
import com.dua.virtusbk.repository.ResourceRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class ResourceService {
    @Autowired
    private ResourceRepository resourceDAO;

    public String[] saveResource(Resource resource) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(resource.getDescriptionResource(), 500)
                && Methods.verifyMaxLength(resource.getNameResource(), 200)) {
            if (Methods.verifyMaxLength(resource.getPathfileResource(), 200)
                    && Methods.verifyMaxLength(resource.getPathurlremoteResource(), 200)
                    && Methods.verifyMaxLength(resource.getPathurlsignResource(), 200)
                    && Methods.verifyMaxLength(resource.getPathvideoResource(), 200)) {

                resource.setDateregResource(Methods.nowLocalDateTime());
                resource.setDateupdateResource(Methods.nowLocalDateTime());
                resource.setStateResource("A");
                resource = resourceDAO.save(resource);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_resource", resource.getId());
                status = "2";
                message = "Recurso agregado con éxito.";
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

    public String[] updateResource(Resource resource) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(resource.getDescriptionResource(), 500)
                && Methods.verifyMaxLength(resource.getNameResource(), 200)) {
            if (Methods.verifyMaxLength(resource.getPathfileResource(), 200)
                    && Methods.verifyMaxLength(resource.getPathurlremoteResource(), 300)
                    && Methods.verifyMaxLength(resource.getPathurlsignResource(), 300)
                    && Methods.verifyMaxLength(resource.getPathvideoResource(), 300)) {

                resource.setDateupdateResource(Methods.nowLocalDateTime());
                resource.setStateResource("A");
                resource = resourceDAO.save(resource);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_resource", resource.getId());
                status = "2";
                message = "Recurso actualizado con éxito.";
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

    public String[] delateResource(Resource resource) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(resource.getDescriptionResource(), 500)
                && Methods.verifyMaxLength(resource.getNameResource(), 200)) {
            if (Methods.verifyMaxLength(resource.getPathfileResource(), 200)
                    && Methods.verifyMaxLength(resource.getPathurlremoteResource(), 300)
                    && Methods.verifyMaxLength(resource.getPathurlsignResource(), 300)
                    && Methods.verifyMaxLength(resource.getPathvideoResource(), 300)) {

                resource.setDateupdateResource(Methods.nowLocalDateTime());
                resource.setDateregResource(Methods.nowLocalDateTime());

                resource.setStateResource("I");
                resource = resourceDAO.save(resource);

                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id_resource", resource.getId());
                status = "2";
                message = "Recurso actualizado con éxito.";
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

    public String[] getResources(String id_topic) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        List<Map<String, Object>> resources = resourceDAO.findIdTopicResourceList2(Long.parseLong(id_topic));
//        List<Resource>  resources = resourceDAO.findIdTopicResourceList(Long.parseLong(id_topic));

        if (resources.size() > 0) {
            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
//            Gson gson = new GsonBuilder().registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter()).create();
            data = gson.toJson(resources);
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }
        return new String[]{status, message, data};
    }

    public String[] getResource(String id_resource) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        List<Map<String, Object>> evaluations = resourceDAO.findIdResource(Long.parseLong(id_resource));
        if (evaluations.size() > 0) {
            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            data = gson.toJson(evaluations);
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
