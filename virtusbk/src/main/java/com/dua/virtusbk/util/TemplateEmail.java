/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.util;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.Util;
import com.dua.virtusbk.repository.PersonRepository;
import com.dua.virtusbk.repository.UtilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.table.DefaultTableModel;
import java.util.List;
import java.util.Optional;

/**
 * @author Geovanny Brito C.
 */
@Service
public class TemplateEmail {

    private Conection conex;
    private final String sentency = "select * from public.utils";

    @Autowired
    public UtilRepository utilDAO;

    public TemplateEmail() {
        conex = new Conection();
    }

    public void insertUser(String email, String name, String lastname, String code) {
//        Thread tr = new Thread(() -> {
        System.out.println("Create user()");
        eInsertUser(email, name, lastname, code);
//        });
//        tr.start();
    }

    public void ActivarUsuario(String email, String names, String state) {
        Thread tr = new Thread(() -> {
            System.out.println("Active user()");
            eActivarUsuario(email, names, state);
        });
        tr.start();
    }

    public void solicitarCodigo(String email, String name, String lastname, String code) {
        Thread tr = new Thread(() -> {
            System.out.println("request code()");
            eSolicitarCodigo(email, name, lastname, code);
        });
        tr.start();
    }

    private void eInsertUser(String email, String name, String lastname, String code) {

//        String respon = "";// utilRepository.findBy(String splantilla); //recorre(utilsData, "splantilla");
//        System.out.println(respon);
//        String urlx = recorre(utilsData, "urlaplication");
//        System.out.println("Enlace= " + urlx);
//        respon = respon.replace("${paramnames}", name + " " + lastname);
//        respon = respon.replace("${paramintro}", "Esta cuenta ha sido activada");
//        respon = respon.replace("${hosturl}", urlx);
//        respon = respon.replace("${hostname}", DataStatic.nameApplication);
//        respon = respon.replace("${paramdetail}", "confirmación de la cuenta");
//        respon = respon.replace("${hosthackurl}", urlx + "verify.html?email=" + email + "&code=" + code);
//
//        Email em = new Email();
//        WeEncoder wEr = new WeEncoder();
//        em.setmyEmailFrom(recorre(utilsData, "email"), wEr.textDecryptor(recorre(utilsData, "emailpass")));
//        em.setContentEmail(email, "Bienvenido a la Comunidad de " + DataStatic.nameApplication, respon);
//        boolean status = em.sendmyEmail();
//        System.out.println("Status send email: " + status);
    }


    private void eActivarUsuario(String email, String names, String state) {
        DefaultTableModel table = conex.returnRecord(sentency);
        String respon = recorre(table, "splantilla");
        String urlx = recorre(table, "urlaplication");

        respon = respon.replace("${paramnames}", names);
        respon = respon.replace("${paramintro}", "Esta cuenta ha sido " + state);
        respon = respon.replace("${hosturl}", urlx);
        respon = respon.replace("${hostname}", DataStatic.nameApplication);
        respon = respon.replace("${paramdetail}", "account confirmation");
        respon = respon.replace("${hosthackurl}", urlx + "index.html");
//        respon = respon.replace("To skip some steps in the process, click on the link below <a href=\"${hosthackurl}\" target=\"_blank\">link</a>.", "");

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), wEr.textDecryptor(recorre(table, "emailpass")));
        em.setContentEmail(email, "Mensaje de la comunidad de " + DataStatic.nameApplication + ".", respon);
        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
    }

    private void eSolicitarCodigo(String email, String name, String lastname, String code) {
        DefaultTableModel table = conex.returnRecord(sentency);
        String respon = recorre(table, "splantilla");
        String urlx = recorre(table, "urlaplication");

        respon = respon.replace("${paramnames}", name + " " + lastname);
        respon = respon.replace("${paramintro}", "You have requested a code for account recovery");
        respon = respon.replace("${hosturl}", urlx);
        respon = respon.replace("${hostname}", DataStatic.nameApplication);
        respon = respon.replace("${paramdetail}", "change of password");
        respon = respon.replace("${hosthackurl}", urlx + "recover_account.html?email=" + email + "&code=" + code);
//        respon = respon.replace("${hosthackurl}", urlx + "resetpassword.html?op=chgpwd&usr=" + email + "&code=" + code);

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), wEr.textDecryptor(recorre(table, "emailpass")));
        em.setContentEmail(email, "Password change request in the " + DataStatic.nameApplication + " community.", respon);

        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
    }

    private String recorre(DefaultTableModel table, String param) {
        String result = "";
        for (int index = 0; index < table.getRowCount(); index++) {
            if (table.getValueAt(index, 0).toString().equals(param)) {
                result = table.getValueAt(index, 1).toString();
            }
        }
        return result;
    }

    public boolean enviarSugerencia(String asunto, String sugerencia) {

        DefaultTableModel table = conex.returnRecord(sentency);

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), wEr.textDecryptor(recorre(table, "emailpass")));
        em.setContentEmail(recorre(table, "email"), asunto + " " + DataStatic.nameApplication + ".", sugerencia);

        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
        return status;
    }
}
