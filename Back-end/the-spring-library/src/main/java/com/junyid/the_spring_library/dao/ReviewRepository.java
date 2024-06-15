package com.junyid.the_spring_library.dao;

import com.junyid.the_spring_library.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByBookId(Long bookId, Pageable pageable);
    Review findByUserEmailAndBookId(String userEmail, Long bookId);

    @Modifying
    @Query("DELETE from Review WHERE bookId = :bookId")
    void deleteAllByBookId(@Param("bookId") Long bookId);
}
