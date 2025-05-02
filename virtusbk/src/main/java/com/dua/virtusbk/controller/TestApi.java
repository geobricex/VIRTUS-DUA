/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dua.virtusbk.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tonyp
 */
@RestController
//@RequestMapping("/")
public class TestApi {

    //@GetMapping("/hello")
    @RequestMapping(value = "hello", method = RequestMethod.GET)
    public String sayHello() {
        return "Hello World";
    }
}
