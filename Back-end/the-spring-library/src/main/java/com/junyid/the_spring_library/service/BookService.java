package com.junyid.the_spring_library.service;

import com.junyid.the_spring_library.dao.BookRepository;
import com.junyid.the_spring_library.dao.CheckoutRepository;
import com.junyid.the_spring_library.entity.Book;
import com.junyid.the_spring_library.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;


@Service
@Transactional
public class BookService {
    // book service will handle the business logic of checking out a book
    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        // inject the BookRepository and CheckoutRepository, done by Spring
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        // is there a checkout already for this user and book?
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null) {
            throw new Exception("Book DNE or the book is already checked out by this user!");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(), LocalDate.now().plusDays(7).toString(), bookId);
        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long BookId){
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, BookId);
        if (validateCheckout != null) {
            return true;
        }else{
            return false;
        }
    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }
}
