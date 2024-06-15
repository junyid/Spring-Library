import React, {useEffect, useState} from "react";
import BookModel from "../../Models/BookModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {StarsReview} from "../Utils/StarsReview";
import {CheckoutAndReviewsBox} from "./CheckoutAndReviewsBox";
import {ReviewModel} from "../../Models/ReviewModel";
import {LatestReviews} from "./LatestReviews";
import {useOktaAuth} from "@okta/okta-react";
import {ReviewRequestModel} from "../../Models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // reviews

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);


    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // loans count
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoansCountLoading, setIsLoansCountLoading] = useState(true);

    // is book checked out!?
    const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
    const [isBookCheckedOutLoading, setIsBookCheckedOutLoading] = useState(true);

    const bookId = window.location.pathname.split('/')[2];


    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };

            setBook(loadedBook);
            setLoading(false);
        }

        fetchBook().catch((e: any) => {
            setError(e.message);
            setLoading(false);
        });
    }, [isBookCheckedOut]);


    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];
            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 10) / 10).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        }

        fetchBookReviews().catch((e: any) => {
            setError(e.message);
            setIsLoadingReview(false);
        });

    }, [isReviewLeft]);


    useEffect(() => {
        // check if user has left a review
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`
                    }
                };

                const response = await fetch(url, requestOptions);

                if (!response.ok) {
                    throw new Error('Failed to fetch user review');
                }

                const responseJson = await response.json();
                setIsReviewLeft(responseJson);
            }

            setIsLoadingUserReview(false);
        }

        fetchUserReviewBook().catch((e: any) => {
            setError(e.message);
            setIsLoadingUserReview(false);
        });
    });

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`
                    }
                };

                const currentLoansResponse = await fetch(url, requestOptions);

                if (!currentLoansResponse.ok) {
                    throw new Error('Failed to fetch current loans count');
                }

                const currentLoansCountJson = await currentLoansResponse.json();
                setCurrentLoansCount(currentLoansCountJson);
            }
            setIsLoansCountLoading(false);
        }
        fetchUserCurrentLoansCount().catch((e: any) => {
            setError(e.message);
            setIsLoansCountLoading(false);
        });
    }, [authState, isBookCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`
                    }
                };
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch checked out book');
                }
                const responseJson = await response.json();
                setIsBookCheckedOut(responseJson);
            }

            setIsBookCheckedOutLoading(false);
        }
        fetchUserCheckedOutBook().catch((e: any) => {
            setError(e.message);
            setIsBookCheckedOutLoading(false);
        });
    }, [authState]);

    if (loading || isLoadingReview || isLoansCountLoading || isBookCheckedOutLoading || isLoadingUserReview) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className="container m-5">
            <p>{error}</p>
        </div>;
    }

    async function checkoutBook() {
        const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Failed to checkout book :(');
        }
        setIsBookCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewInput: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewInput);

        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`
            },
            body: JSON.stringify(reviewRequestModel)
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to submit review');
        }
        setIsReviewLeft(true);

    }


    return (
        <div>
            <div className={'container d-none d-lg-block'}>
                <div className={'row mt-5'}>
                    <div className={'col-sm-2 col-md-2'}>
                        {book?.img ?
                            <img src={book?.img}
                                 width='226'
                                 height='349'
                                 alt='Book'
                            />
                            :
                            <img src={require('../../Images/BooksImages/default.png')}
                                 width='226'
                                 height='349'
                                 alt='Book'
                            />
                        }
                    </div>
                    <div className={'col-4 col-md-4 container'}>
                        <div className={'ml-2'}>
                            <h2>{book?.title}</h2>
                            <h5 className={'text-primary'}>{book?.author}</h5>
                            <p className={'lead'}>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewsBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                                           isAuthenticated={authState?.isAuthenticated}
                                           isCheckedOut={isBookCheckedOut} checkoutBook={checkoutBook}
                                           isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>

            <div className={'container d-lg-none mt-5'}>
                <div className={'d-flex justify-content-center align-items-center'}>
                    {book?.img ?
                        <img src={book?.img}
                             width='226'
                             height='349'
                             alt='Book'
                        />
                        :
                        <img src={require('../../Images/BooksImages/default.png')}
                             width='226'
                             height='349'
                             alt='Book'
                        />
                    }
                </div>
                <div className={'mt-4'}>
                    <div className={'ml-2'}>
                        <h2>{book?.title}</h2>
                        <h5 className={'text-primary'}>{book?.author}</h5>
                        <p className={'lead'}>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewsBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                                       isAuthenticated={authState?.isAuthenticated}
                                       isCheckedOut={isBookCheckedOut} checkoutBook={checkoutBook}
                                       isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}