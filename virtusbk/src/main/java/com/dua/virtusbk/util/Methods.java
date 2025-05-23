/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.util;

import com.dua.virtusbk.entity.Person;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.swing.table.DefaultTableModel;

/**
 * This java class contains the methods used within the back-end
 * of the application.
 *
 * @author CleanCode *
 */
public final class Methods {

    public static String[] getDataToJwt(String jwt) {
        String[] response;
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(DataStatic.privateKey)
                    .parseClaimsJws(jwt.replace("{", "").replace("}", "")).getBody();
            response = new String[]{claims.get("user").toString(), claims.get("permit").toString()};
        } catch (Exception e) {
            System.out.println("error JWT: " + e.getMessage());
            response = new String[]{"", ""};
        }
        return response;
    }

    public static String personToJson(Person person) {
        String key = DataStatic.privateKey;
        long tiempo = System.currentTimeMillis();
        JwtBuilder jwtb = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, key)
                .setSubject("-1")
                .claim("user", person.getId())
                .claim("permit", person.getTypePerson())
                .setIssuedAt(new Date(tiempo));

//        if (!customer.equals("mobile") && !customer.equals("desktop")) {
        jwtb = jwtb.setExpiration(new Date(tiempo + 10800000));//180 min
//        }

        return jwtb.compact();
    }

    public static String getJsonMessage(String status, String information, String data) {
        return "{\"status\":" + status + ",\"information\":\"" + information + "\",\"data\":" + data + "}";
    }

    /**
     * This method is for the security application.
     *
     * @param request Processes HTTP type requests
     * @param param   String type variable, contains the information obtained to
     *                the method.
     * @param defaulx String type variable, return variable
     * @return a String, for the security request.
     */
    public static String securRequest(HttpServletRequest request, String param, String defaulx) {
        try {
            String res = request.getParameter(param);
            return res != null ? res : defaulx;
        } catch (Exception e) {
            return defaulx;
        }
    }

    /**
     * This method is for the security application.
     *
     * @param email String type variable, contains the email.
     * @return a String, for the security request.
     */
    public static Boolean comprobeEmail(String email) {
        Pattern pat = Pattern.compile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");//".*@uteq.edu.ec"
        Matcher mat = pat.matcher(email);
        if (mat.matches()) {
            return (email.length() <= 100);// length in database
        } else {
            return false;
        }
    }

    public static Boolean comprobePassword(String pass) {
        Pattern pat = Pattern.compile("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[\\w\\W]{6,16}$");///^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/
        Matcher mat = pat.matcher(pass);
        return mat.matches();// length in database
    }

    /**
     * Convert from string to json.
     *
     * @param json String type variable, contains the json to be converted.
     * @return a json.
     */
    public static JsonObject stringToJSON(String json) {
        try {
            JsonParser parser = new JsonParser();
            JsonObject Jso = parser.parse(json).getAsJsonObject();
            return Jso;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new JsonObject();
        }
    }

    /**
     * Convert from string to json.
     *
     * @param json String type variable, contains the json to be converted.
     * @return a json.
     */
    public static JsonArray stringToJsonArray(String json) {
        try {
            JsonParser parser = new JsonParser();
            JsonArray jsa = parser.parse(json).getAsJsonArray();
            return jsa;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new JsonArray();
        }
    }

    /**
     * Convert from string to json.
     *
     * @param json String type variable, contains the json to be converted.
     * @return a json.
     */
    public static JsonElement stringToJSON2(String json) {
        try {
            JsonElement parser = new JsonPrimitive(json);
            System.out.println(parser.getAsString());
            //JsonObject Jso = new JsonObject();
            //Jso =  (JsonObject) parser.p(json);
            return parser;
        } catch (Exception e) {
            return new JsonObject();
        }
    }

    /**
     * Get a part of the json.
     *
     * @param jso   Variable type json, contains the information.
     * @param param String type variable, contains the name of the json
     *              parameter to be divided.
     * @return a json, divided.
     */
    public static JsonElement securGetJSON(JsonObject jso, String param) {
        try {
            JsonElement res = jso.get(param);//request.getParameter(param);
            return res;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Method to divide a json.
     *
     * @param jso     Variable type json, contains the information.
     * @param param   String type variable, contains the name of the json
     *                parameter to be divided.
     * @param defaulx String type variable, return variable
     * @return Return a String, with the json divided.
     */
    public static String JsonToSub(JsonObject jso, String param, String defaulx) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                return res.toString();
            } else {
                return defaulx;
            }
        } catch (Exception e) {
            return defaulx;
        }
    }

    /**
     * A sub json of a json.
     *
     * @param jso   Variable type json, contains the information.
     * @param param String type variable, contains the name of the json
     *              parameter to be divided.
     * @return a json.
     */
    public static JsonObject JsonToSubJSON(JsonObject jso, String param) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                return res.getAsJsonObject();
            } else {
                return new JsonObject();
            }
        } catch (Exception e) {
            return new JsonObject();
        }
    }

    /**
     * From json to array.
     *
     * @param jso   Variable type json, contains the information.
     * @param param String type variable, contains the name of the json
     *              parameter to be divided.
     * @return a jsonArray, with data loaded
     */
    public static JsonArray JsonToArray(JsonObject jso, String param) {
        try {
            JsonArray jarr = jso.get(param).getAsJsonArray();
            if (jarr != null) {
                return jarr;
            } else {
                return new JsonArray();
            }
        } catch (Exception e) {
//            System.out.println("erro json a string");
            return new JsonArray();
        }
    }

    public static String[] JsonToStringVecttor(JsonObject jso, String param) {
        Gson gson = new Gson();

        try {
            String[] jarr = gson.fromJson(jso.get(param), String[].class);
            if (jarr != null) {
                return jarr;
            } else {
                return new String[]{};
            }
        } catch (Exception e) {
//            System.out.println("erro json a string");
            return new String[]{};
        }
    }

    /**
     * From json to String
     *
     * @param jso     Variable type json, contains the information.
     * @param param   String type variable, contains the name of the json
     *                parameter to be divided.
     * @param defaulx String type variable, return variable
     * @return a String, with data loaded from the json.
     */
    public static String JsonToString(JsonObject jso, String param, String defaulx) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                String result = res.getAsString();
                result = result.trim().replace("\n", "\\n").replace("\t", "\\t").replace("'", "''");
                return result;
            } else {
                return defaulx;
            }
        } catch (Exception e) {
//            System.out.println("erro json a string");
            return defaulx;
        }
    }

    public static JsonObject objectToJson(Object jsonO) {
        try {
            return (JsonObject) jsonO;
        } catch (Exception e) {
            return new JsonObject();
        }
    }

    public static JsonArray objectToJsonArray(Object jsonarrayO) {
        try {
            return (JsonArray) jsonarrayO;
        } catch (Exception e) {
            return new JsonArray();
        }
    }

    public static String JsonToStringWithFormat(JsonObject jso, String param, String defaulx) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                String result = res.getAsString();
                return result;
            } else {
                return defaulx;
            }
        } catch (Exception e) {
//            System.out.println("erro json a string");
            return defaulx;
        }
    }

    /**
     * Obtain an element from a Json, and store it in a String variable.
     *
     * @param jse     The variable type JsonElement, contains the information.
     * @param defaulx String type variable, contains the element of the selected
     *                json.
     * @return a variable of type String, selected element of the json.
     */
    public static String JsonElementToString(JsonElement jse, String defaulx) {
        try {
            if (jse != null) {
                return jse.getAsString();
            } else {
                return defaulx;
            }
        } catch (Exception e) {
            return defaulx;
        }
    }

    /**
     * from JsonElement to json.
     *
     * @param jse Variable type jsonElement, contains an element of another
     *            json.
     * @return an object-type json
     */
    public static JsonObject JsonElementToJSO(JsonElement jse) {
        try {
            if (jse != null) {
                return jse.getAsJsonObject();
            } else {
                return new JsonObject();
            }
        } catch (Exception e) {
            return new JsonObject();
        }
    }

    /**
     * from json to Integer.
     *
     * @param jso     Variable type json, contains the information
     * @param param   String type variable, contains the name of the json
     *                parameter to be divided.
     * @param defaulx String type Integer, return variable
     * @return an integer, the variable is defaulx.
     */
    public static int JsonToInteger(JsonObject jso, String param, int defaulx) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                return res.getAsInt();
            } else {
                return defaulx;
            }
        } catch (Exception e) {
            return defaulx;
        }
    }

    /**
     * from json to boolean
     *
     * @param jso     Variable type json, contains the information
     * @param param   String type variable, contains the name of the json
     *                parameter to be divided.
     * @param defaulx String type Boolean, return variable
     * @return an Boolean, the variable is defaulx.
     */
    public static Boolean JsonToBoolean(JsonObject jso, String param, boolean defaulx) {
        try {
            JsonElement res = securGetJSON(jso, param);
            if (res != null) {
                return res.getAsBoolean();
            } else {
                return defaulx;
            }
        } catch (Exception e) {
            return defaulx;
        }
    }

    /**
     * From table to json.
     *
     * @param table Variable of type DefaultTableModel, table with loaded data
     * @return a String, contains a json with data.
     */
    public static String tableToJson(DefaultTableModel table) {
        String resul = "[";
        if (table.getRowCount() > 0) {
            int columCount = table.getColumnCount();
            for (int row = 0; row < table.getRowCount(); row++) {
                String line = "";
                for (int colum = 0; colum < columCount; colum++) {
                    String ro = table.getValueAt(row, colum).toString();
                    System.out.println(ro + ":" + JsonValid(ro));
                    ro = JsonValid(ro) ? ro : String.format("\"%s\"", ro.replace("\n", "\\n").replace("\t", "\\t").replace("\"", "\\\""));
                    line += "\"" + table.getColumnName(colum) + "\":" + ro;
                    if (colum < columCount - 1) {
                        line += ",";
                    }
                }
                if (line.length() > 0) {
                    resul += "{" + line + "}";
                    if (row < table.getRowCount() - 1) {
                        resul += ",";
                    }
                }
            }
            resul += "]";
        } else {
            resul = "[]";
        }
        System.out.println(resul);
        return resul;
    }

    /**
     * Convert from a table to an html5 table
     *
     * @param table Variable of type DefaultTableModel, table with loaded data
     * @return a String, with an html5 table with data.
     */
    public static String tableToHtmlTable(DefaultTableModel table) {
        String resul = "<table>";
        if (table != null) {
            int columCount = table.getColumnCount();
            resul += "<thead><tr>";
            for (int fol = 0; fol < table.getColumnCount(); fol++) {
                resul += String.format("<th>%s</th>", table.getColumnName(fol));
            }
            resul += "</tr></thead>";
            resul += "<tbody>";
            for (int row = 0; row < table.getRowCount(); row++) {
                resul += "<tr>";
                for (int colum = 0; colum < columCount; colum++) {
                    resul += String.format("<td>%s</td>", table.getValueAt(row, colum));
                }
                resul += "</tr>";
            }
            resul += "</tbody>";
        }
        resul += "</table>";
        return resul;
    }

    /**
     * Convert from string to integer, and then convert back to string.
     *
     * @param number String type variable, contains an integer to validate.
     * @return Returns a string, validating if it is integer.
     */
    public static String StringToIntegerString(String number) {
        int num;
        try {
            num = Integer.parseInt(number);
        } catch (Exception e) {
            num = -1;
        }
        return String.valueOf(num);
    }

    public static boolean isInteger(String number) {
        try {
            int num = Integer.parseInt(number);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * @param xml the xml string to validate how xml
     * @return returns a boolean
     */
    public static boolean xmlvalidPG(String xml) {
        String result = new Conection().fillString("select xml_valid('" + xml + "')");
//        System.out.println("dbsaid:"+result);
        return result.equals("t");
    }

    public static boolean JsonValid(String json) {
        try {
            JsonParser parser = new JsonParser();
            JsonElement jse = parser.parse(json);
            boolean flag1 = false, flag2 = false;
            try {
                jse.getAsJsonObject();
                flag1 = true;
            } catch (Exception e) {
                flag1 = false;
            }
            try {
                jse.getAsJsonArray();
                flag2 = true;
            } catch (Exception e) {
                flag2 = false;
            }
            return (flag1 || flag2);
        } catch (Exception e) {
//            System.out.println(e.getMessage());
            return false;
        }
    }

    public static Boolean isValidCoordinates(String coordinatesValue) {
        //Longitud es coordenadas X, Latitud es coordeadas Y
        String twoDoublesRegularExpression = "-?[1-9][0-9]*(\\.[0-9]+)?,\\s*-?[1-9][0-9]*(\\.[0-9]+)?";
        return coordinatesValue.matches(twoDoublesRegularExpression);
    }

    public static String verifyUrl(String context, String directory, String foldername, String extension) {
        File fil = null;
        int count = -1;
        FileAccess fac = new FileAccess();
        foldername = fac.cleanFileName(foldername);
        do {
            count++;
            fil = new File(DataStatic.getLocation(context) + directory + foldername + (count == 0 ? "" : count)
                    + extension);
        } while (fil.exists());
        return foldername + (count == 0 ? "" : count);
    }

    public static Boolean testregex(String pattern, String text) {
        Pattern pat = Pattern.compile(pattern);
        Matcher mat = pat.matcher(text);
        return mat.matches();
    }

    public static Boolean verifyString(String text, String unEqString, int length) {
        if (!text.equals(unEqString)) {
            // -1 para indicar que no existe un maxlength
            if (length > -1) {
                return (text.length() <= length);
            } else {
                return true;
            }
        }
        return false;
    }

    public static Boolean verifyMaxLength(String text, int length) {
        return (text.length() <= length);
    }

    public static int wordsCount(String text, String spaces) {
        int contador = 1, pos;//**METODO PIRATEADO XD
        text = text.trim(); //eliminar los posibles espacios en blanco al principio y al final                              
        if (text.isEmpty()) { //si la cadena está vacía
            contador = 0;
        } else {
            pos = text.indexOf(spaces); //se busca el primer espacio en blanco
            while (pos != -1) {   //mientras que se encuentre un espacio en blanco
                contador++;    //se cuenta una palabra
                pos = text.indexOf(spaces, pos + spaces.length()); //se busca el siguiente espacio en blanco                       
            }                                    //a continuación del actual
        }
        return contador;
    }

    public static Boolean verifyMaxWords(String text, int length, String spaces) {
        int contador = wordsCount(text, spaces);
        return (contador > 0 && contador <= length);
    }

    public static Boolean verifyParraf(String text, int length, String spaces) {
        int contador = wordsCount(text, spaces);
        return (contador <= length);
    }

    public static JsonObject getIndixJarray(JsonArray jarr, int indice) {
        if (indice > -1 && indice < jarr.size()) {
            try {
                return jarr.get(indice).getAsJsonObject();
            } catch (Exception e) {
                return new JsonObject();
            }
        } else {
            return new JsonObject();
        }
    }

    public static JsonObject RowToJson(DefaultTableModel table, int index) {
        String resul = "";
        if (table.getRowCount() > 0 && index >= 0 && index < table.getRowCount()) {
            int columCount = table.getColumnCount();
            for (int row = 0; row < table.getRowCount(); row++) {
                String line = "";

                if (row == index) {
                    for (int colum = 0; colum < columCount; colum++) {
                        String ro = table.getValueAt(row, colum).toString();
                        System.out.println(ro + ":" + JsonValid(ro));
                        ro = JsonValid(ro) ? ro : String.format("\"%s\"", ro.replace("\n", "\\n").replace("\t", "\\t").replace("\"", "\\\""));
                        line += "\"" + table.getColumnName(colum) + "\":" + ro;
                        if (colum < columCount - 1) {
                            line += ",";
                        }
                    }
                    if (line.length() > 0) {
                        resul = "{" + line + "}";
                    }
                }
            }
        } else {
            resul = "{}";
        }
        System.out.println(resul);
        return Methods.stringToJSON(resul);
    }

    public static int getIndexSearch(DefaultTableModel table, String value, int param) {
        int index = -1;
        for (int cont = 0; cont < table.getRowCount(); cont++) {
            if (table.getValueAt(cont, param).toString().equals(value)) {
                index = cont;
            }
        }
        return index;
    }

    /**
     * 1 permit !=S 2 permit = U|A|R 3 permit = A|R 4 permit = R
     *
     * @param identifier
     * @param permit
     * @param flag
     * @return
     */
    public static String[] validatePermit(String identifier, String permit, int flag) {
        String status = "4", message = "Sesión invalida.", data = "[]";
        if (!identifier.equals("") && !permit.equals("")) {
            switch (flag) {
                case 0:
                    if (permit.equals("S")) {// unequal // S
                        status = "2";
                        message = "Sesión válida";
                    } else {
                        status = "3";
                        message = "Your account has already been verified.";
                        data = "[]";
                    }
                    break;
                case 1:
                    if (!permit.equals("S")) {// unequal // S
                        status = "2";
                        message = "Sesión válida";
                    } else {
                        status = "5";
                        message = "Account not verified.";
                        data = "[]";
                    }
                    break;
                case 2:
                    if (permit.equals("U") || permit.equals("A") || permit.equals("R")) {
                        status = "2";
                        message = "Sesión válida";
                    } else {
                        status = "3";
                        message = "This content is not available to you.";
                        data = "[]";
                    }
                    break;
                case 3:
                    if (permit.equals("A") || permit.equals("R")) {
                        status = "2";
                        message = "Sesión válida";
                    } else {
                        status = "3";
                        message = "You do not have the required permissions for this action.";
                        data = "[]";
                    }
                    break;
                case 4:
                    if (permit.equals("R")) {
                        status = "2";
                        message = "Sesión válida";
                    } else {
                        status = "3";
                        message = "This action is only available to the Administrator.";
                        data = "[]";
                    }
                    break;
                default:
                    break;
            }
        }
        return new String[]{status, message, data};
    }

    public static int randomNumberInRange(int minimo, int maximo) {
        // nextInt regresa en rango pero con límite superior exclusivo, por eso sumamos 1
        return ThreadLocalRandom.current().nextInt(minimo, maximo + 1);
    }

    public static LocalDateTime nowLocalDateTime() {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime fechaOutput = LocalDateTime.parse(timeStamp, formatter); //parsea a LocalDateTime , la fecha de entrada con el respectivo formato indicado
        return fechaOutput;
    }

    public static JSONArray sortJsonArray(JSONArray array, String paramkey) {
        List<JSONObject> jsons = new ArrayList<JSONObject>();
        for (int i = 0; i < array.length(); i++) {
            jsons.add(array.getJSONObject(i));
        }
        Collections.sort(jsons, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject lhs, JSONObject rhs) {
                String lid = lhs.getString(paramkey);
                String rid = rhs.getString(paramkey);
                // Here you could parse string id to integer and then compare.
                return lid.compareTo(rid);
            }
        });
        return new JSONArray(jsons);
    }

}
