package com.dua.virtusbk.service;

import com.dua.virtusbk.entity.Util;
import com.dua.virtusbk.repository.UtilRepository;
import com.dua.virtusbk.util.DataStatic;
import com.dua.virtusbk.util.Email;
import com.dua.virtusbk.util.Methods;
import com.dua.virtusbk.util.WeEncoder;
import com.google.gson.JsonArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;


@Service
@Transactional
public class UtilService {
    @Autowired
    private UtilRepository utilDAO;

    public boolean eMessageUser(String email, String name, String lastname, String message) {
//         List<Util> utils = utilDAO.returnUtilsData();

        Optional<Util> findsplantilla = utilDAO.findById("splantillaM");
        Optional<Util> findurlaplication = utilDAO.findById("urlaplication");
        Optional<Util> findemailpass = utilDAO.findById("emailpass");
        Optional<Util> findemail = utilDAO.findById("email");
        //Mejorar sin tanta consulta

        if (findsplantilla.isPresent() && findurlaplication.isPresent()
                && findemailpass.isPresent() && findemail.isPresent()) {

            String respon = findsplantilla.get().getValueUtil();
            String urlx = findurlaplication.get().getValueUtil();
            respon = respon.replace("${paramnames}", name + " " + lastname);
            respon = respon.replace("${paramintro}", "Correo generado automáticamente ");
            respon = respon.replace("${hosturl}", urlx);
            respon = respon.replace("${hostname}", DataStatic.nameApplication);
            respon = respon.replace("${parammessaging}", message);

            Email em = new Email();
            WeEncoder wEr = new WeEncoder();
            em.setmyEmailFrom(findemail.get().getValueUtil(), wEr.textDecryptor(findemailpass.get().getValueUtil()));
            em.setContentEmail(email, "Saludos desde la Comunidad de " + DataStatic.nameApplication, respon);
            boolean status = em.sendmyEmail();
            System.out.println("Status send email: " + status);
            return status;
        } else {
            return false;
        }

    }

    public boolean eInsertUser(String email, String name, String lastname, String code) {
//         List<Util> utils = utilDAO.returnUtilsData();

        Optional<Util> findsplantilla = utilDAO.findById("splantilla");
        Optional<Util> findurlaplication = utilDAO.findById("urlaplication");
        Optional<Util> findemailpass = utilDAO.findById("emailpass");
        Optional<Util> findemail = utilDAO.findById("email");
        //Mejorar sin tanta consulta

        if (findsplantilla.isPresent() && findurlaplication.isPresent()
                && findemailpass.isPresent() && findemail.isPresent()) {

            String respon = findsplantilla.get().getValueUtil();
            String urlx = findurlaplication.get().getValueUtil();
            respon = respon.replace("${paramnames}", name + " " + lastname);
            respon = respon.replace("${paramintro}", "Esta cuenta ha sido activada");
            respon = respon.replace("${hosturl}", urlx);
            respon = respon.replace("${hostname}", DataStatic.nameApplication);
            respon = respon.replace("${paramdetail}", "confirmación de la cuenta");
            respon = respon.replace("${hosthackurl}", urlx + "/#/verify/" + email + "/" + code);

            Email em = new Email();
            WeEncoder wEr = new WeEncoder();
            em.setmyEmailFrom(findemail.get().getValueUtil(), wEr.textDecryptor(findemailpass.get().getValueUtil()));
            em.setContentEmail(email, "Bienvenido a la Comunidad de " + DataStatic.nameApplication, respon);
            boolean status = em.sendmyEmail();
            System.out.println("Status send email: " + status);
            return status;
        } else {
            return false;
        }

    }

    public boolean eCodeUser(String email, String name, String lastname, String code) {
//         List<Util> utils = utilDAO.returnUtilsData();

        Optional<Util> findsplantilla = utilDAO.findById("splantilla2");
        Optional<Util> findurlaplication = utilDAO.findById("urlaplication");
        Optional<Util> findemailpass = utilDAO.findById("emailpass");
        Optional<Util> findemail = utilDAO.findById("email");
        //Mejorar sin tanta consulta

        if (findsplantilla.isPresent() && findurlaplication.isPresent()
                && findemailpass.isPresent() && findemail.isPresent()) {

            String respon = findsplantilla.get().getValueUtil();
            String urlx = findurlaplication.get().getValueUtil();
            respon = respon.replace("${paramnames}", name + " " + lastname);
            respon = respon.replace("${paramintro}", "Este código sirve en la aplicación ");
            respon = respon.replace("${hosturl}", urlx);
            respon = respon.replace("${hostname}", DataStatic.nameApplication);
            respon = respon.replace("${paramcode}", code);

            Email em = new Email();
            WeEncoder wEr = new WeEncoder();
            em.setmyEmailFrom(findemail.get().getValueUtil(), wEr.textDecryptor(findemailpass.get().getValueUtil()));
            em.setContentEmail(email, "Saludos desde la Comunidad de " + DataStatic.nameApplication, respon);
            boolean status = em.sendmyEmail();
            System.out.println("Status send email: " + status);
            return status;
        } else {
            return false;
        }
    }

    public String[] getInformationHome(int id_type, String id_param) {
        System.out.println("getInformationHome");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        String homeInformation = utilDAO.returnInformationHome(id_type, Integer.parseInt(id_param));

        JsonArray jso = Methods.stringToJsonArray(homeInformation);
        if (!jso.toString().equals("[]")) {
            status = "2";
            message = "Información retornada con éxito.";
            data = jso.toString();
        }
        System.out.println(data);

        return new String[]{status, message, data};
    }
}
