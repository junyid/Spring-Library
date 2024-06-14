package com.junyid.the_spring_library.service;

import com.junyid.the_spring_library.dao.BookRepository;
import com.junyid.the_spring_library.dao.CheckoutRepository;
import com.junyid.the_spring_library.dao.HistoryRepository;
import com.junyid.the_spring_library.entity.Book;
import com.junyid.the_spring_library.entity.Checkout;
import com.junyid.the_spring_library.entity.History;
import com.junyid.the_spring_library.responsemodels.ShelfCurrentLoansResponse;
import org.hibernate.annotations.Check;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {
  // book service will handle the business logic of checking out a book
  private BookRepository bookRepository;
  private CheckoutRepository checkoutRepository;
  private HistoryRepository historyRepository;

  public BookService(
      BookRepository bookRepository,
      CheckoutRepository checkoutRepository,
      HistoryRepository historyRepository) {
    // inject the BookRepository and CheckoutRepository, done by Spring
    this.bookRepository = bookRepository;
    this.checkoutRepository = checkoutRepository;
    this.historyRepository = historyRepository;
  }

  public Book checkoutBook(String userEmail, Long bookId) throws Exception {
    Optional<Book> book = bookRepository.findById(bookId);

    // is there a checkout already for this user and book?
    Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

    if (!book.isPresent() || validateCheckout != null) {
      throw new Exception("Book DNE or the book is already checked out by this user!");
    }

    book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
    bookRepository.save(book.get());

    Checkout checkout =
        new Checkout(
            userEmail, LocalDate.now().toString(), LocalDate.now().plusDays(7).toString(), bookId);
    checkoutRepository.save(checkout);

    return book.get();
  }

  public Boolean checkoutBookByUser(String userEmail, Long BookId) {
    Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, BookId);
    if (validateCheckout != null) {
      return true;
    } else {
      return false;
    }
  }

  public int currentLoansCount(String userEmail) {
    return checkoutRepository.findBooksByUserEmail(userEmail).size();
  }

  public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
    List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
    List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
    List<Long> bookIdList = new ArrayList<>();

    for (Checkout i : checkoutList) {
      bookIdList.add(i.getBookId());
    }

    List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    for (Book book : books) {
      Optional<Checkout> checkout =
          checkoutList.stream().filter(i -> i.getBookId().equals(book.getId())).findFirst();
      if (checkout.isPresent()) {
        Date d1 = sdf.parse(checkout.get().getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;
        long difference_in_time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        shelfCurrentLoansResponses.add(
            new ShelfCurrentLoansResponse(book, (int) difference_in_time));
      }
    }

    return shelfCurrentLoansResponses;
  }

  public void returnBook(String userEmail, Long bookId) throws Exception {
    Optional<Book> book = bookRepository.findById(bookId);
    Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
    if (!book.isPresent() || validateCheckout == null) {
      throw new Exception("Book does not exist or the book is not checked out by this user!");
    }

    book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
    bookRepository.save(book.get());
    checkoutRepository.deleteById(validateCheckout.getId());

    History history =
        new History(

            userEmail,
            validateCheckout.getCheckoutDate(),
            LocalDate.now().toString(),
            book.get().getTitle(),
            book.get().getAuthor(),
            book.get().getDescription(),
            book.get().getImg());

    historyRepository.save(history);
  }

  public void renewLoan(String userEmail, Long bookId) throws Exception {
    Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
    if (validateCheckout == null) {
      throw new Exception("Book is not checked out by this user!");
    }

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    Date d1 = sdf.parse(validateCheckout.getReturnDate()); // return date
    Date d2 = sdf.parse(LocalDate.now().toString()); // current date

    if (d1.getTime() - d2.getTime() < 0) {
      throw new Exception("Book is overdue, cannot renew loan!");
    }

    validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
  }
}
