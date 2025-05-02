package com.dua.virtusbk;

import com.dua.virtusbk.entity.Person;
import com.dua.virtusbk.entity.PersonsCours;
import com.dua.virtusbk.repository.PersonRepository;
import com.dua.virtusbk.util.WeEncoder;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.codec.binary.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

@SpringBootTest
class VirtusbkApplicationTests {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Test
    void testPersonCours() {
//        PersonsCours personsCours = new PersonsCours();
//
//        personsCours.setStatePersonCourse("A");
//        System.out.println(personsCours.returnJSON());


//        Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeProxiedFields()).create();
//        String rGson = gson.toJson(personsCours);
//        System.out.println(rGson);
//
//        assert (rGson.equals(""));//

    }

    @Test
    void testPerson() {
//        Person person = new Person();
//
//        person.setPasswordPerson(bCryptPasswordEncoder.encode("JenyNoMeQuiere"));
//        System.out.println("PASSWORD= " + person.getPasswordPerson());
//
//        assert (!person.getPasswordPerson().equals("JenyNoMeQuiere"));

//        assert(person.getPasswordPerson().equals("$2a$10$o6hu0j36Aoi/Cotr0JO0E.6OsYNN55pFx8VB9Upwg6s1aSGUh8aYK"));//$2a$10$3vEwZXT5.BbXtnye5BVzDeEnYKFZQHLi0AfwijZ20IiU7.wVoXJpi
    }

    @Test
    public void MD5() throws NoSuchAlgorithmException, UnsupportedEncodingException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {

        String Cifrar = "vzfjjafvqmkaotkl";

        String base64EncryptedString = "";

        String secretKey = "VIRTUS-DUA"; //llave para desenciptar datos
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digestOfPassword = md.digest(secretKey.getBytes("utf-8"));
        byte[] keyBytes = Arrays.copyOf(digestOfPassword, 24);

        SecretKey key = new SecretKeySpec(keyBytes, "DESede");
        Cipher cipher = Cipher.getInstance("DESede");
        cipher.init(Cipher.ENCRYPT_MODE, key);

        byte[] plainTextBytes = Cifrar.getBytes("utf-8");
        byte[] buf = cipher.doFinal(plainTextBytes);
        byte[] base64Bytes = Base64.encodeBase64(buf);
        base64EncryptedString = new String(base64Bytes);

        String base64DesecryptedString = base64EncryptedString;
        byte[] message = Base64.decodeBase64(base64DesecryptedString.getBytes("utf-8"));
        MessageDigest mdD = MessageDigest.getInstance("MD5");
        byte[] digestOfPasswordD = mdD.digest(secretKey.getBytes("utf-8"));
        byte[] keyBytesD = Arrays.copyOf(digestOfPasswordD, 24);
        SecretKey keyD = new SecretKeySpec(keyBytesD, "DESede");

        Cipher decipher = Cipher.getInstance("DESede");
        decipher.init(Cipher.DECRYPT_MODE, keyD);

        byte[] plainText = decipher.doFinal(message);

        base64DesecryptedString = new String(plainText, "UTF-8");

        System.out.println(Cifrar);
        System.out.println(base64DesecryptedString);
        System.out.println(base64EncryptedString);

//        assert (base64DesecryptedString, Cifrar);
    }
}
