package com.junyid.the_spring_library.controller;

import com.junyid.the_spring_library.entity.Message;
import com.junyid.the_spring_library.requestmodels.AdminQuestionRequest;
import com.junyid.the_spring_library.service.MessagesService;
import com.junyid.the_spring_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {
    private MessagesService messagesService;

    @Autowired
    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader("Authorization") String token, @RequestBody Message messageRequest) {
        String email = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        messagesService.postMessage(messageRequest, email);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(value = "Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String email = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!admin.equals("admin")) {
            throw new Exception("Unauthorized");
        }
        messagesService.putMessage(adminQuestionRequest, email);
    }

}
