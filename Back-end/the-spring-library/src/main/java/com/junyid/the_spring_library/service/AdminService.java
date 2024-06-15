package com.junyid.the_spring_library.service;

import com.junyid.the_spring_library.dao.BookRepository;
import com.junyid.the_spring_library.dao.CheckoutRepository;
import com.junyid.the_spring_library.dao.ReviewRepository;
import com.junyid.the_spring_library.entity.Book;
import com.junyid.the_spring_library.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
@Transactional
public class AdminService {
    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;
    @Autowired
    public AdminService(BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public void increaseBookQuantity(Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new Exception("Book not found"));
        book.setCopies(book.getCopies() + 1);
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        bookRepository.save(book);
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new Exception("Book not found"));
        if (book.getCopiesAvailable() <= 0 || book.getCopies() <= 0) {
            throw new Exception("No copies available");
        }
        book.setCopies(book.getCopies() - 1);
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);
    }

    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }
        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }

}
