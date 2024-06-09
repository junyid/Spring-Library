package com.junyid.the_spring_library.dao;

import com.junyid.the_spring_library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {}
