package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.EvaluationQuestionCategory;
import com.dua.virtusbk.entity.QuestionCategory;
import com.dua.virtusbk.repository.EvaluationQuestionCategoryRepository;
import com.dua.virtusbk.repository.EvaluationRepository;
import com.dua.virtusbk.util.Methods;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.google.gson.*;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.*;


@Service
@Transactional
public class EvaluationService {
    @Autowired
    private EvaluationRepository evaluationDAO;

    @Autowired
    private EvaluationQuestionCategoryRepository evaluationQuestionCategoryDAO;

    public String[] saveEvaluation(Evaluation evaluation) {
        System.out.println("saveEvaluation");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(evaluation.getNameEvaluation(), 500)
                && Methods.verifyMaxLength(evaluation.getDescriptionEvaluation(), 500)) {
            evaluation.setDateregEvaluation(Methods.nowLocalDateTime());
            evaluation.setDateupdateEvaluation(Methods.nowLocalDateTime());
            evaluation.setState_evaluation("A");
            evaluation.setNumberquestionEvaluation(120);
            System.out.println(evaluation);
            evaluation = evaluationDAO.save(evaluation);

            //*TABLA INTERMEDIA*//
            //*1 EVLUACIÓN CON MUCHOS TIPOS DE PREGUNTA*//
            List<EvaluationQuestionCategory> evaluationQuestionCategories = new ArrayList<>();
            for (int typeQuestion = 1; typeQuestion <= 7; typeQuestion++) {
                evaluationQuestionCategories.add
                        (new EvaluationQuestionCategory
                                (evaluation, new QuestionCategory((long) typeQuestion), 0));
            }
            evaluationQuestionCategories = evaluationQuestionCategoryDAO.saveAll(evaluationQuestionCategories);
            //*FIN TABLA INTERMEDIA*//

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id_evaluation", evaluation.getId());
            status = "2";
            message = "Evaluación registrada con éxito.";
            data = jsonObject.toString();
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateEvaluation(Evaluation evaluation) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(evaluation.getNameEvaluation(), 500)
                && Methods.verifyMaxLength(evaluation.getDescriptionEvaluation(), 500)) {
            evaluation.setDateupdateEvaluation(Methods.nowLocalDateTime());
            evaluation.setState_evaluation("A");
            evaluation = evaluationDAO.save(evaluation);

            //*TABLA INTERMEDIA*//
            //*1 EVLUACIÓN CON MUCHOS TIPOS DE PREGUNTA*//
            List<EvaluationQuestionCategory> evaluationQuestionCategories = new ArrayList<>();
            for (int typeQuestion = 1; typeQuestion <= 6; typeQuestion++) {
                evaluationQuestionCategories.add
                        (new EvaluationQuestionCategory
                                (evaluation, new QuestionCategory((long) typeQuestion), 0));
            }
            evaluationQuestionCategories = evaluationQuestionCategoryDAO.saveAll(evaluationQuestionCategories);
            //*FIN TABLA INTERMEDIA*//

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id_evaluation", evaluation.getId());
            status = "2";
            message = "Evaluación actualizada con éxito.";
            data = jsonObject.toString();
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};

    }

    public String[] deleteEvaluation(Evaluation evaluation) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(evaluation.getNameEvaluation(), 500)
                && Methods.verifyMaxLength(evaluation.getDescriptionEvaluation(), 500)) {
            evaluation.setDateupdateEvaluation(Methods.nowLocalDateTime());
            evaluation.setState_evaluation("I");

            evaluation = evaluationDAO.save(evaluation);

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id_evaluation", evaluation.getId());
            status = "2";
            message = "Evaluación desactivada con éxito.";
            data = jsonObject.toString();
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};

    }

    public String[] getEvaluations(String id_topic, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String evaluations = evaluationDAO.findIdTopicEvaluationList(Integer.parseInt(id_topic), Integer.parseInt(id_person));
        JsonArray jso = Methods.stringToJsonArray(evaluations);
        if (!jso.toString().equals("[]")) {
//            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            data = jso.toString();
            status = "2";
            message = "Información obetnida con éxito.";
            System.out.println(data);

        } else {
            status = "3";
            message = "No se ha encontrado información.";
        }

        return new String[]{status, message, data};
    }

    public String[] getEvaluation(String id_evaluation) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Map<String, Object>> evaluations = evaluationDAO.findIdEvaluation(Long.parseLong(id_evaluation));
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

    public String[] getEvaluationQuestions(String id_evaluation, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String homeInformation = evaluationDAO.returnEvaluation(Integer.parseInt(id_evaluation), Integer.parseInt(id_person));

        JsonArray jso = Methods.stringToJsonArray(homeInformation);
        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";

            if (!jso.get(0).getAsJsonObject().get("order_category").getAsBoolean()) {
                JSONArray jsonArrayOrder = new JSONArray((jso.get(0).getAsJsonObject().get("questions_")).toString());
                jsonArrayOrder = Methods.sortJsonArray(jsonArrayOrder, "order_question");
//                System.out.println(jsonArrayOrder);
                /*Volver a cargar los datos*/
                JSONArray newjsonArray = new JSONArray((jso.toString()));
                newjsonArray.getJSONObject(0).put("questions_", jsonArrayOrder);
//                System.out.println(newjsonArray);
                status = "2";
                message = "Información retornada con éxito.";
                data = newjsonArray.toString();
                return new String[]{status, message, data};
            } else {
                data = jso.toString();
            }
        } else {
            status = "3";
            message = "No se ha encontrado datos.";
        }
        return new String[]{status, message, data};
    }

    public String[] getAllEvaluationQuestions(String id_evaluation, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String homeInformation = evaluationDAO.returnAllEvaluation(Integer.parseInt(id_evaluation), Integer.parseInt(id_person));

        JsonArray jso = Methods.stringToJsonArray(homeInformation);
        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";
            data = jso.toString();
            return new String[]{status, message, data};

        } else {
            status = "3";
            message = "No se ha encontrado datos.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateQuantityQuestions(String quantity_question, String id_evaluation, String id_question_category) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        System.out.println("updateQuantityQuestions");
//        try {

        if (Methods.isInteger(quantity_question) &&
                Methods.isInteger(id_question_category) &&
                Methods.isInteger(id_evaluation) &&
                Long.parseLong(quantity_question) >= 0) {
            Long id_evaluation_question_category = evaluationQuestionCategoryDAO.updatePersonsQuestions
                    (Long.parseLong(quantity_question), Long.parseLong(id_evaluation), Long.parseLong(id_question_category));
            status = "2";
            message = "Cantidad de preguntas asignadas con éxito.";
            data = "[{\"id_evaluation_question_category\":" + id_evaluation_question_category + "}]";
        } else {
            status = "4";
            message = "No se puede asignar esa cantidad de preguntas;";
        }
//        } catch (Exception exception) {
//            status = "4";
//            message = exception.toString();
//        }
        return new String[]{status, message, data};
    }

    public String[] selectQuantityQuestions(String id_evaluation) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
//        try {

        List<Map<String, Object>> evaluationQuestionCategories =
                evaluationQuestionCategoryDAO.findByAllEvaluationsIdEvaluation((Long.parseLong(id_evaluation)));

        Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();

        status = "2";
        message = "Cantidad de preguntas retornadas con éxito.";
        data = gson.toJson(evaluationQuestionCategories);
//        } catch (Exception exception) {
//            status = "4";
//            message = exception.toString();
//        }

        return new String[]{status, message, data};
    }

}
