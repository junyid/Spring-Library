package com.junyid.the_spring_library.service;


import com.junyid.the_spring_library.dao.MessageRepository;
import com.junyid.the_spring_library.entity.Message;
import com.junyid.the_spring_library.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessagesService {
    private MessageRepository messageRepository;

    @Autowired
    public MessagesService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception{
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());
        if (message.isPresent()) {
            message.get().setAdminEmail(userEmail);
            message.get().setResponse(adminQuestionRequest.getResponse());
            message.get().setClosed(true);
            messageRepository.save(message.get());
        } else {
            throw new Exception("Message not found");
        }
    }
}
