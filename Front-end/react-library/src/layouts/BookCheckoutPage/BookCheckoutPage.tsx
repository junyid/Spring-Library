import React, {useEffect, useState} from "react";
import BookModel from "../../Models/BookModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {StarsReview} from "../Utils/StarsReview";
import {CheckoutAndReviewsBox} from "./CheckoutAndReviewsBox";
import {ReviewModel} from "../../Models/ReviewModel";
import {LatestReviews} from "./LatestReviews";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const bookId = window.location.pathname.split('/')[2];


    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

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
    }, []);


    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
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

    }, []);


    if (loading || isLoadingReview) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className="container m-5">
            <p>{error}</p>
        </div>;
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
                    <CheckoutAndReviewsBox book={book} mobile={false}/>
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
                <CheckoutAndReviewsBox book={book} mobile={true}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}