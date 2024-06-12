import React from "react";
import BookModel from "../../Models/BookModel";
import {Link} from "react-router-dom";
import {LeaveAReview} from "../Utils/LeaveAReview";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;

export const CheckoutAndReviewsBox: React.FC<{
    book: BookModel | undefined,
    mobile: boolean,
    currentLoansCount: number,
    isAuthenticated: any,
    isCheckedOut: boolean,
    checkoutBook: any,
    isReviewLeft: boolean,
    submitReview: any,

}> = (props) => {

    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5) {
                return <button onClick={() => props.checkoutBook()}
                               className={'btn btn-success btn-lg'}>Checkout</button>
            } else if (props.isCheckedOut) {
                return <p><b>✔️ Book checked out, enjoy!</b></p>
            } else if (!props.isCheckedOut) {
                return <div className="alert alert-danger" role="alert">
                    ❌ Too many books checked out.
                </div>
            }
        }
        return <Link to={'/login'} className={'btn btn-success btn-lg'}>Sign in</Link>
    }


    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return <LeaveAReview submitReview={props.submitReview}/>
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return <div className="alert alert-success" role="alert">
                🎉 Thank you for your review
            </div>
        }
        return <div>
            Sign in to be able to leave a review.
        </div>
    }


    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className={'card-body container'}>
                <div className={'mt-3'}>
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr/>
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className={'text-success'}>
                            Available
                        </h4> :
                        <h4 className={'text-danger'}>
                            Waitlist
                        </h4>
                    }
                    <div className={'row'}>
                        <p className={'col-6 lead'}>
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className={'col-6 lead'}>
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr/>
                <p className={'mt-3'}>
                    This number can change until placing order has been complete.
                </p>
                {reviewRender()}
            </div>
        </div>
    );
}