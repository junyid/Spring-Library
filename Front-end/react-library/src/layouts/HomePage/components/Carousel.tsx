import {ReturnBook} from "./ReturnBook";
import React, {useEffect, useState} from "react";
import BookModel from "../../../Models/BookModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Link} from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = 'http://localhost:8080/api/books';
            const url: string = `${baseUrl}?page=0&size=9`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push(
                    {
                        id: responseData[key].id,
                        title: responseData[key].title,
                        author: responseData[key].author,
                        description: responseData[key].description,
                        copies: responseData[key].copies,
                        copiesAvailable: responseData[key].copiesAvailable,
                        category: responseData[key].category,
                        img: responseData[key].img
                    }
                );
                setBooks(loadedBooks);
                setLoading(false);
            }
        }

        fetchData().catch((e: any) => {
            setError(e.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className="container m-5">
            <p>{error}</p>
        </div>;
    }


    return (
        <div className='container mt-5' style={{height: 550}}>
            <div className='homepage-carousel-title'>
                <h3>Find your next favourite.</h3>
            </div>

            <div
                id='carouselExampleControls'
                className='carousel carousel-dark slide mt-5 d-none d-lg-block'
                data-bs-interval='false'
            >
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(0, 3).map((book: BookModel) => {
                                return <ReturnBook key={book.id} book={book}/>
                            })}
                        </div>
                    </div>

                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(3, 6).map((book: BookModel) => {
                                return <ReturnBook key={book.id} book={book}/>
                            })}
                        </div>
                    </div>

                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(6, 9).map((book: BookModel) => {
                                return <ReturnBook key={book.id} book={book}/>
                            })}
                        </div>
                    </div>
                </div>

                <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target='#carouselExampleControls'
                    data-bs-slide='prev'
                >
          <span
              className='carousel-control-prev-icon'
              aria-hidden='true'
          ></span>
                    <span className='visually-hidden'>Previous</span>
                </button>

                <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target='#carouselExampleControls'
                    data-bs-slide='next'
                >
          <span
              className='carousel-control-next-icon'
              aria-hidden='true'
          ></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>

            {/* Mobile */}

            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnBook book={books[0]} key={books[0].id}/>
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to={'/search'}>
                    View More
                </Link>
            </div>
        </div>
    );
};
