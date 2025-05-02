package com.dua.virtusbk.service;

import com.dua.virtusbk.entity.Answer;
import com.dua.virtusbk.repository.AnswerRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Transactional
public class AnswerService {
    @Autowired
    private AnswerRepository answerDAO;

    public String[] saveAnswers(Answer answer) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.verifyMaxLength(answer.getOptionsAnswer(), 80000)) {
            answer.setDateregAnswer(Methods.nowLocalDateTime());
            answer.setDateupdateAnswer(Methods.nowLocalDateTime());
            answer = answerDAO.save(answer);

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id_answer", answer.getId());
            status = "2";
            message = "Respuestas registradas con éxito.";
            data = jsonObject.toString();
        } else {
            status = "3";
            message = "Longitud excedida en uno de los campos ingresados.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateAnswers(Answer answer) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        answer.setDateupdateAnswer(Methods.nowLocalDateTime());
        answer = answerDAO.save(answer);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id_answer", answer.getId());
        status = "2";
        message = "Respuestas actualizadas con éxito.";
        data = jsonObject.toString();

        return new String[]{status, message, data};
    }

    public String[] getAnswers(String id_) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        return new String[]{status, message, data};
    }

}
