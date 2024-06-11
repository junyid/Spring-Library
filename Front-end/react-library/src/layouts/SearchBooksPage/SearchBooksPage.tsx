import React, {useEffect, useState} from "react";
import BookModel from "../../Models/BookModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {SearchBook} from "./components/SearchBook";
import {Pagination} from "../Utils/Pagination";

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

    const [category, setCategory] = useState('Book Category');

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = 'http://localhost:8080/api/books';
            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                url = baseUrl + searchUrl;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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
            }
            setBooks(loadedBooks);
            setLoading(false);
        }

        fetchData().catch((e: any) => {
            setError(e.message);
            setLoading(false);
        });

        window.scrollTo(0, 0);

    }, [currentPage, searchUrl]);

    if (loading) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className="container m-5">
            <p>{error}</p>
        </div>;
    }

    const searchHandleChange = () => {

        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>$size=${booksPerPage}`);
        }
    }


    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (value.toLowerCase() === 'fe' || value.toLowerCase() === 'be' || value.toLowerCase() === 'data' || value.toLowerCase() === 'devops') {
            setCategory(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<PageNumber>$size=${booksPerPage}`);
        } else {
            setCategory('All');
            setSearchUrl(`?page=0$size=${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container m-5'>
                <div>
                    <div className="row mt-5">
                        <div className={"col-6"}>
                            <div className={"d-flex"}>
                                <input className={"form-control me-2"} type={"search"} placeholder={"Search"}
                                       aria-labelledby={"Search"} onChange={e => setSearch(e.target.value)}/>
                                <button className={"btn btn-outline-success"}
                                        onClick={() => searchHandleChange()}>Search
                                </button>
                            </div>
                        </div>

                        <div className={"col-4"}>
                            <div className={"dropdown"}>
                                <button className={"btn btn-secondary dropdown-toggle"} type={"button"}
                                        id={"dropdownMenuButton1"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>
                                    {category}
                                </button>
                                <ul className={"dropdown-menu"} aria-labelledby={"dropdownMenuButton1"}>
                                    <li><a className={"dropdown-item"} href={"#"}
                                           onClick={() => categoryField('All')}>All</a></li>
                                    <li><a className={"dropdown-item"} href={"#"} onClick={() => categoryField('FE')}>Front
                                        end</a></li>
                                    <li><a className={"dropdown-item"} href={"#"} onClick={() => categoryField('BE')}>Back
                                        end</a></li>
                                    <li><a className={"dropdown-item"} href={"#"}
                                           onClick={() => categoryField('Data')}>Data</a></li>
                                    <li><a className={"dropdown-item"} href={"#"}
                                           onClick={() => categoryField('DevOps')}>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className={"mt-3"}>
                                <h5>Number of results: {totalAmountOfBooks}</h5>
                            </div>

                            <p> {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:</p>

                            {books.map(book => (<SearchBook book={book} key={book.id}/>)
                            )}

                            {totalPages > 1 &&
                                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

                        </> :
                        <div className={"m-5"}>
                            <h3>Can't find what you are looking for?</h3>
                            <a className={"btn main-color btn-md px-4 me-md-2 fw-bold text-white"} href={"#"}>Library
                                Services</a>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}