package com.junyid.the_spring_library.dao;

import com.junyid.the_spring_library.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findMessagesByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);
    Page<Message> findMessagesByClosed(@RequestParam("closed") boolean closed, Pageable pageable);
}
