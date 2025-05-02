/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.util;

import javax.xml.crypto.Data;

/**
 * @author CleanCode
 */
public class DataStatic {

    public static String nameApplication = "VIRTUS";

    /**
     * aplicaciones.uteq.edue.ec*
     */
//    public static String dbName = "cQf5KIlaaVd6IRjES95RoQ==";
//    public static String dbUser = "9qy+3vHmh8zClkk38dnm3g==";
//    public static String dbPassword = "Xg54kwNTey9YPcFBN6WNWWABv+Q+C4mg4xW9VO+zN7jClkk38dnm3g==";
//    public static String dbPort = "nYsIHU+jDcE=";
//    public static String dbHost = "EjCoYJyzeuQdRCjDM4JrjA==";//remoto
//    
    /**
     * bioforest.uteq.edue.ec*
     */
    public static String dbName = "KziH2Jb350TIQsgD8AMqBsKWSTfx2ebe";
    public static String dbUser = "9qy+3vHmh8zClkk38dnm3g==";
    public static String dbPassword = "Ok9kbRfRsOrgEkfJ8bouhge5dQQCpnO5ytBA+lbCxOEpTujTi/G1ORNoJ/GC0fI1nqj5cldF+8fwdA8vXBJpGZCZhyGfxpMWiunNJ5XG+y/h+wXA59Lpe+r2O2YPHAVBSy7gzFoLNMM=";
    public static String dbPort = "nYsIHU+jDcE=";
    public static String dbHost = "i+aTFOSJFYo6UcZQmtEsRg=="; //remoto

    public static String privateKey = "CleanCode&BRICEX";

    public static String protocol = "wss";
    //    public static String uriWebSockeet = "://localhost:8080";
    public static String uriWebSockeet = "://localhost:443";

    private static String fileLocation = "";

    private static String StringTarget = "";//
    private static String StringReplacement = "";

    public static String proyectName = "/";

    public static String folderUser = "UserImage/";

    public static String folderProjects = "/";

    public static String getLocation(String context) {
        if (!fileLocation.equals("")) {
            context = fileLocation;
        }
        return context.replace(StringTarget, StringReplacement);
    }

    //    public static String avatarUser[] = {
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/DH5QMfmyOmb9amUzE8bx8cOoP3U9KiED.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/VY6GPUg1LikvONdlzNpl8LXMXySnAwjt.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/E2ZPMjFSslMEO7xXALoaGfIEOKp344FF.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/ZhhGNxqcg1tRIaOUywNWtTOGuGZipcuI.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/cjZRirzZKZRPedDJxanubAGq1fn0FHKO.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/HYeTqCFtQLhAOJGX2NJBOz2ABIhHZX7U.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/LuV2xf6e2Q1EyU6tKORzy82ivVj0IG6g.png",
//            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/fy1slm2CJ2nFoll/R385p7pc3VlVSsaNtZaqcBMfFpej13eu.png"
//    };
    public static String avatarUser[] = {
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/c4TI0hFWchjzlFjDjNb6hp8JpXw0tAmM.png",//paloma
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/MmEcidSf5cTgdRV1AtLGN4Pi4sO9nWfD.png",//elefante
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/q0XEor2cF2h4GrsloT7xTAHgNEaY8jae.png",//morza
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/r08Xf0mYdLuz1OFQXPMj3ZmG6uwM4aXa.png",//tigre
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/9rrUuGVG4ep8QejNlOhQfoqkqki3ZK2P.png",//vaca
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/WAVkyXYIZpdA93VIkJhh327tp3uM4jxA.png",//alce
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/RBSr3TFTj29AAjPD1qfXGFpnOPoZoAl4.png",//caballo
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/hkWhaLgyTjxCWEYbIZ5DJAhIP48VbIcT.png",//cabra
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/ptIWCVQELOYS2mV3DQXc8pOdbe8m5RPc.png",//rinoceronte
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/HcS5vleLE5OXhOx1yOi95WPgF0rVPlnc.png",//venado
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/bI3UnrRJABu12q8pzswAuMtM0oDT7zhZ.png",//gorila
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/SnzOlBKapg5MIxrhPC8VS0tldIlQ8GL0.png",//hipopótamo
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/8nKZ5siKeLvAFu6uRojMIxTFhQx8HLXW.png",//cerdo
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/EzRB3YSZVicus7CU2U8xxCW1ZS8tYa2G.png",//gato
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/xVAR5UMUVuHAtRJnctRSJIIWHF00egRL.png",//zorro
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/hrOSvnw3MulIO4HHgMRZd3fQ4meS5bMK.png",//jirafa
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/EVsyS8Xq8Jwlq5dieuAIuSBdu2vXE5g3.png",//león
            "https://fyc.uteq.edu.ec:9549/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/mBnytNCGmR2vzJxLX5lfts7wRpOSH6QA.png"//conejo
    };
}
