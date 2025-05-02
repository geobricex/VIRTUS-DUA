package com.dua.virtusbk.service;

import com.dua.virtusbk.ExcludeProxiedFields;
import com.dua.virtusbk.dto.PersonsEvaluationsDto;
import com.dua.virtusbk.entity.Evaluation;
import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.PersonsEvaluations;
import com.dua.virtusbk.repository.PersonsEvaluationsRepository;
import com.dua.virtusbk.util.Methods;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class PersonsEvaluationsService {
    @Autowired
    private PersonsEvaluationsRepository personsEvaluationsDAO;

    public String[] savePersonsEvaluations(String result_evaluation, String qualification_person_evaluation,
                                           String timespent_person_evaluation, String evaluations_id_evaluation,
                                           String persons_id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        PersonsEvaluations personsEvaluations = new PersonsEvaluations();
        personsEvaluations.setResultEvaluation(result_evaluation);
        personsEvaluations.setQualificationPersonEvaluation(Double.parseDouble(qualification_person_evaluation));
        personsEvaluations.setTimespentPersonEvaluation(Double.parseDouble(timespent_person_evaluation));
        personsEvaluations.setPersonsIdPerson(new Person(Long.parseLong(persons_id_person)));
        personsEvaluations.setEvaluationsIdEvaluation(new Evaluation(Long.parseLong(evaluations_id_evaluation)));
        personsEvaluations.setDateregPersonEvaluation(Methods.nowLocalDateTime());
        List<PersonsEvaluations> personsEvaluationsList = personsEvaluationsDAO.findByPersonsIdPersonAndEvaluationsIdEvaluation(new Person(Long.parseLong(persons_id_person)), new Evaluation(Long.parseLong(evaluations_id_evaluation)));
        personsEvaluations.setTrynumberPersonEvaluation(personsEvaluationsList.size() + 1);
        personsEvaluations = personsEvaluationsDAO.save(personsEvaluations);
        System.out.println(personsEvaluations);
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id_person_evaluation", personsEvaluations.getId());
        status = "2";
        message = "Respuestas registradas con éxito.";
        data = jsonObject.toString();

        return new String[]{status, message, data};
    }

    public String[] getPersonsEvaluations(int type, Long id_evaluation, Long id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

//        List<Map<String, Object>> personsEvaluations = personsEvaluationsDAO.findByEvaluationsIdEvaluationAndPersonsIdPerson(
//                new Evaluation(id_evaluation), new Person(id_person));
//        System.out.println("select infor from evaluations_review_select("+type+","+id_evaluation+", "+id_person+")");
        String personsEvaluations = personsEvaluationsDAO.findByEvaluationsIdEvaluationAndPersonsIdPerson(
                type, (id_evaluation), (id_person));


        status = "2";
        message = "Resultados retornado con éxito.";
        data = personsEvaluations;

        return new String[]{status, message, data};
    }

    public String[] updatePersonsEvaluations(PersonsEvaluations personsEvaluations) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        personsEvaluations = personsEvaluationsDAO.save(personsEvaluations);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id_person_evaluation", personsEvaluations.getId());
        status = "2";
        message = "Respuestas actualizadas con éxito.";
        data = jsonObject.toString();

        return new String[]{status, message, data};
    }

}
