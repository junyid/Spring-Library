import {ReviewModel} from "../../../Models/ReviewModel";
import {useEffect, useState} from "react";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Review} from "../../Utils/Review";
import {Pagination} from "../../Utils/Pagination";

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');


    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [reviewsPerPage] = useState<number>(5);

    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);


    // extract bookId from URL
    const bookId = (window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
            }


            setReviews(loadedReviews);
            setLoading(false);
        }

        fetchBookReviews().catch((e: any) => {
            setError(e.message);
            setLoading(false);
        });

    }, [currentPage]);

    if (loading) {
        return (<SpinnerLoading/>);
    }

    if (error) {
        return <div>
            <h1>Error</h1>
            <p>{error}</p>
        </div>;
    }

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }


    return (
        <div className={'container m-5'}>
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>

            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} comments
            </p>

            <div>
                {reviews.map((review, index) => {
                    return <Review review={review} key={review.id}/>;
                })}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>

    );
}