package com.dua.virtusbk.service;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.repository.PersonRepository;
import com.dua.virtusbk.util.DataStatic;
import com.dua.virtusbk.util.Methods;
import com.dua.virtusbk.util.WeEncoder;
import com.google.gson.JsonObject;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
public class PersonService {
    @Autowired
    private PersonRepository personDAO;

    @Autowired
    private UtilService utilService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private WeEncoder weEncoder;

    public Person getPerson(Long id_person) {
        System.out.println(id_person);
        Optional<Person> findUtil = personDAO.findById(id_person);

        if (findUtil.isPresent()) {
            return (findUtil.get());
        } else {
            return null;
        }
    }

//    public List<Person> getPersons(Long id_person) {
//        List<Person> listPerson = personDAO.findByIdNotOrderByDateregPerson(id_person);
//        if (listPerson.size() >= 0)
//            return listPerson;
//        else
//            return null;
//    }

    public String[] getPersons(Long id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        List<Person> listPerson = personDAO.findByIdNotOrderByDateregPerson(id_person);
        if (listPerson.size() >= 0) {
            System.out.println(listPerson);
//            Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
            JSONArray jsonArray = new JSONArray(listPerson);
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

    public String[] signUp(Person person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        System.out.println(person.getEmailPerson());
        if (Methods.comprobeEmail(person.getEmailPerson())
                && ((Methods.comprobePassword(person.getPasswordPerson())
                && person.getProviderPerson().equals("native")))
                && Methods.testregex("[0-9]+\\-[0-9]+\\-[0-9]+", person.getIdLocation())
                && Methods.verifyMaxLength(person.getNamePerson(), 50)
                && Methods.verifyMaxLength(person.getLastnamePerson(), 50)) {
            System.out.println("sigUp...");
            List<Person> Persons = personDAO.findByEmailList(person.getEmailPerson());
            if (Persons.size() == 0) {// no exista un usuario con el correo electrónico
                String sendEmailCode = weEncoder.getEmailCode();

                person.setNamePerson(person.getNamePerson().toUpperCase().trim());
                person.setLastnamePerson(person.getLastnamePerson().toUpperCase().trim());
                person.setCodeverificationPerson(sendEmailCode);
                person.setEmailPerson(person.getEmailPerson().toLowerCase().trim());
                person.setPasswordPerson(bCryptPasswordEncoder.encode(person.getPasswordPerson().trim()));
                person.setTypePerson("S");
                /*FECHA*/
                person.setDateregPerson(Methods.nowLocalDateTime());
                person.setDateupdatePerson(Methods.nowLocalDateTime());
                /*FIN FECHA*/
                /*AVATAR ALEATORIO*/
                String[] avatarUser = DataStatic.avatarUser;
                int indexRandom = Methods.randomNumberInRange(0, avatarUser.length - 1);
                person.setPathimgPerson(avatarUser[indexRandom]);
                /*FIN AVATAR ALEATORIO*/
                person = personDAO.save(person);
                if (person.getTypePerson().equals("S")) {

                    if (utilService.eInsertUser(person.getEmailPerson(), person.getNamePerson(), person.getLastnamePerson(), person.getCodeverificationPerson())) {
                        status = "2";
                        message = "Usuario registrado con éxito.";
                        data = personToJson(person).toString();
                    } else {
                        status = "4";
                        message = "Error al enviar código de verificación.";
                        throw new RuntimeException("Error in Send Email");
                    }
                } else {
                    status = "4";
                    message = "Datos del usuario no disponibles.";
                }
            } else {
                status = "3";
                message = "El correo ingresado ya se encuentra registraso.";
            }
        } else {
            status = "3";
            message = "Los parámetros ingresados no son válidos.";
        }
        return new String[]{status, message, data};

    }

    public String[] updatePerson(Person person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";

        if (Methods.isInteger(person.getId().toString())
                //Methods.testregex("[0-9]+\\-[0-9]+\\-[0-9]+", person.getIdLocation()
                // && Methods.comprobeEmail(person.getEmailPerson())
                // && ((Methods.comprobePassword(person.getPasswordPerson())
                // && person.getProviderPerson().equals("native")))
                && Methods.verifyMaxLength(person.getNamePerson(), 50)
                && Methods.verifyMaxLength(person.getLastnamePerson(), 50)
        ) {
            System.out.println(person);

            if (!person.getTypePerson().equals("S") && !person.getTypePerson().equals("I")) {
//                PersonDto personDto = new PersonDto(person.getId(), person.getNamePerson(), person.getLastnamePerson(), person.getEmailPerson(), person.getTypePerson(), Methods.nowLocalDateTime());

                person.setNamePerson(person.getNamePerson().toUpperCase().trim());
                person.setLastnamePerson(person.getLastnamePerson().toUpperCase().trim());
                person.setDateupdatePerson(Methods.nowLocalDateTime());

                person = personDAO.save(person);
                String textMessage = "Sus datos se han actualizado de forma exitosa.";
//                utilService.eMessageUser(person.getEmailPerson(), person.getNamePerson(), person.getLastnamePerson(), textMessage);
                status = "2";
                message = "Datos del usuario actualizados.";
            } else {
                status = "4";
                message = "Datos del usuario no disponibles.";
            }

        } else {
            status = "3";
            message = "Los parámetros ingresados no son válidos";
        }
        return new String[]{status, message, data};
    }

    public String[] changePassword(String password, String newPassword, String id_person) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        Optional<Person> Persons = personDAO.findById(Long.parseLong(id_person));

        if (Persons.isPresent()) {

            if (bCryptPasswordEncoder.matches(password, Persons.get().getPasswordPerson())
                    && !bCryptPasswordEncoder.matches(newPassword, Persons.get().getPasswordPerson())) {

                newPassword = bCryptPasswordEncoder.encode(newPassword.trim());

                Persons.get().setPasswordPerson(newPassword);
                Persons.get().setDateupdatePerson(Methods.nowLocalDateTime());
                personDAO.save(Persons.get());
                String textMessage = "Su contraseña ha sido actualizada con éxito.";
                utilService.eMessageUser(Persons.get().getEmailPerson(), Persons.get().getNamePerson(), Persons.get().getLastnamePerson(), textMessage);
                status = "2";
                message = "Contraseña actualizada.";
            } else {
                status = "5";
                message = "No se puede actualizar la contraseña.";
            }

        } else {
            status = "4";
            message = "Usuario no encontrado.";
        }
        return new String[]{status, message, data};
    }

    public String[] requestCode(String flag, String email, String code) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        List<Person> Persons = personDAO.findByEmailList(email);
        if (Persons.size() == 1) {// solo exista un usuario con el correo electrónico
            switch (flag) {
                case "1":// Aceptar código
                    if (Persons.get(0).getCodeverificationPerson().equals(code)) {
                        Persons.get(0).setTypePerson("U");
                        Persons.get(0).setDateupdatePerson(Methods.nowLocalDateTime());
                        personDAO.save(Persons.get(0));
                        status = "2";
                        message = "Código de verificación es el correcto.";
                    } else {
                        status = "5";
                        message = "Código de verificación no es el correcto.";
                    }

                    break;
                case "2":// Reenviar nuevo código
                    String codeEmail = weEncoder.getEmailCode();
                    Persons.get(0).setCodeverificationPerson(codeEmail);
                    Persons.get(0).setDateupdatePerson(Methods.nowLocalDateTime());
                    personDAO.save(Persons.get(0));
                    if (utilService.eCodeUser(Persons.get(0).getEmailPerson(), Persons.get(0).getNamePerson(), Persons.get(0).getLastnamePerson(), Persons.get(0).getCodeverificationPerson())) {
                        status = "2";
                        message = "Se ha enviado el código de verificación.";
                    } else {
                        status = "4";
                        message = "Error al enviar código de verificación.";
                        throw new RuntimeException("Error in Send Email");
                    }

                    break;
            }
        } else {
            status = "4";
            message = "Usuario no encontrado.";
        }
        return new String[]{status, message, data};
    }

    public String[] recoverAccount(String email, String password, String code) {
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        List<Person> Persons = personDAO.findByEmailList(email);
        if (Persons.size() == 1) {// solo exista un usuario con el correo electrónico

            if (Persons.get(0).getCodeverificationPerson().equals(code)) {
                Persons.get(0).setTypePerson("U");//Rol de Usuario nuevamente
                Persons.get(0).setPasswordPerson(bCryptPasswordEncoder.encode(password));
                Persons.get(0).setDateupdatePerson(Methods.nowLocalDateTime());
                personDAO.save(Persons.get(0));
                status = "2";
                message = "Código de verificación es el correcto.";
            } else {
                status = "5";
                message = "Código de verificación no es el correcto.";
            }

        } else {
            status = "4";
            message = "Usuario no encontrado.";
        }
        return new String[]{status, message, data};
    }

    public String[] logIn(String email, String password, String provider) {
        System.out.println("logIn Controller");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.comprobeEmail(email)
                && ((Methods.comprobePassword(password)
                && provider.equals("native")))) {
            Person person = new Person();
            person.setEmailPerson(email.toLowerCase());
            person.setPasswordPerson(password.trim());

            List<Person> Persons = personDAO.findByEmailList(person.getEmailPerson());

            if (Persons.size() == 1) {// solo exista un usuario con el correo electrónico
                if (bCryptPasswordEncoder.matches(person.getPasswordPerson(), Persons.get(0).getPasswordPerson())) {
                    switch (Persons.get(0).getTypePerson()) {
                        case "S":
                            status = "5";
                            message = "La cuenta no se encuentra verificada.";
                            break;
                        case "D":
                            status = "5";
                            message = "La cuenta se encuentra inactiva.";
                            break;
                        case "A":
                            status = "2";
                            message = "Sesión de administración iniciada con éxito.";
                            break;
                        case "R":
                            status = "2";
                            message = "Sesión de super administrador iniciada con éxito.";
                            break;
                        case "U":
                            status = "2";
                            message = "Sesión iniciada con éxito.";
                            break;
                        case "I":
                            status = "2";
                            message = "Sesión de instructor iniciada con éxito.";
                            break;
                        case "E":
                            status = "2";
                            message = "Sesión de educador iniciada con éxito.";
                            break;
                        default:
                            status = "3";
                            message = "Los parámetros de acceso no son válidos.";
                            return new String[]{status, message, data};
                    }
                    data = "[" + personToJson(Persons.get(0)).toString() + "]";
                } else {
                    status = "3";
                    message = "Correo electrónico y/o contraseña no coinciden.";
                }

            } else {
                status = "4";
                message = "Usuario no encontrado.";
            }
        } else {
            if (!provider.equals("native")) {
                status = "3";
                message = "Los parámetros de acceso no son válidos, verifique que está accediendo con el proveedor correcto.";
            } else {
                status = "3";
                message = "Los parámetros ingresados no son válidos";
            }
        }

        return new String[]{status, message, data};
    }

    public String[] logInOAuth(String useremail, String username, String userlastname, String userid, String userimage, String provider) {
        System.out.println("logInOAuth Controller");
        String status = "4", message = "Error en los parámetros introducidos", data = "[]";
        if (Methods.comprobeEmail(useremail)
                && provider.equals("google.com")) {
            Person person = new Person();
            person.setEmailPerson(useremail.toLowerCase());
            person.setNamePerson(username.toUpperCase());
            person.setLastnamePerson(userlastname.toUpperCase());
            person.setPasswordPerson(bCryptPasswordEncoder.encode(userid.trim()));
            person.setPathimgPerson(userimage);
            person.setProviderPerson(provider);
            person.setCodeverificationPerson("");
            person.setTypePerson("U");
            person.setIdLocation("0-0-0");
            /*FECHA*/
            person.setDateregPerson(Methods.nowLocalDateTime());
            person.setDateupdatePerson(Methods.nowLocalDateTime());
            /*FIN FECHA*/
            List<Person> Persons = personDAO.findByEmailList(person.getEmailPerson());

            if (Persons.size() == 1) {// solo exista un usuario con el correo electrónico
                if (Persons.get(0).getProviderPerson().equals("google.com")) {
                    switch (Persons.get(0).getTypePerson()) {
                        case "S":
                            status = "5";
                            message = "La cuenta no se encuentra verificada.";
                            break;
                        case "D":
                            status = "5";
                            message = "La cuenta se encuentra inactiva.";
                            break;
                        case "A":
                            status = "2";
                            message = "Sesión de administración iniciada con éxito.";
                            break;
                        case "R":
                            status = "2";
                            message = "Sesión de super administrador iniciada con éxito.";
                            break;
                        case "U":
                            status = "2";
                            message = "Sesión iniciada con éxito.";
                            break;
                        case "I":
                            status = "2";
                            message = "Sesión de instructor iniciada con éxito.";
                            break;
                        case "E":
                            status = "2";
                            message = "Sesión de educador iniciada con éxito.";
                            break;
                        default:
                            status = "3";
                            message = "Los parámetros de acceso no son válidos.";
                            return new String[]{status, message, data};
                    }
                    data = "[" + personToJson(Persons.get(0)).toString() + "]";
                } else {
                    status = "3";
                    message = "Los parámetros de acceso no son válidos, verifique que está accediendo con el proveedor correcto.";
                }
            } else {
                person = personDAO.save(person);
                message = "Se ha registrado con éxito.";
                if (utilService.eMessageUser(person.getEmailPerson(), person.getNamePerson(), person.getLastnamePerson(), message)) {
                    status = "2.2";
                    data = personToJson(person).toString();
                    System.out.println(status);
                }
            }
        } else {
            if (!provider.equals("google.com")) {
                status = "3";
                message = "Los parámetros de acceso no son válidos, verifique que está accediendo con el proveedor correcto.";
            } else {
                status = "3";
                message = "Los parámetros ingresados no son válidos";
            }
        }

        return new String[]{status, message, data};
    }

    public JsonObject personToJson(Person person) {
        JsonObject jsonObject = new JsonObject();
//        jsonObject.addProperty("user_token", getJWTTokenfromUser(person));
        jsonObject.addProperty("user_token", Methods.personToJson(person));
        jsonObject.addProperty("email_person", person.getEmailPerson());
        jsonObject.addProperty("lastname_person", person.getLastnamePerson());
        jsonObject.addProperty("name_person", person.getNamePerson());
        jsonObject.addProperty("type_person", person.getTypePerson());
        jsonObject.addProperty("provider_person", person.getProviderPerson());
        jsonObject.addProperty("pathimg_person", person.getPathimgPerson());
        return jsonObject;
    }

    public String getJWTTokenfromUser(Person person) {

        List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                .commaSeparatedStringToAuthorityList(person.getTypePerson());

        String tokenJWT = Jwts
                .builder()
                .setId("softtekJWT")
                .setSubject(person.getEmailPerson())
                .claim("user", person.getId())
                .claim("permit", person.getTypePerson())
                .claim("authorities",
                        grantedAuthorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 10800000))//180 min
                .signWith(SignatureAlgorithm.HS512,
                        DataStatic.privateKey.getBytes()).compact();

        return tokenJWT;
    }

}
