import {ReviewModel} from "../../Models/ReviewModel";
import {StarsReview} from "./StarsReview";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
    const date = new Date(props.review.date);
    const longMonth = date.toLocaleString('en-us', {month: 'long'});
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();
    const dateString = `${longMonth} ${dateDay}, ${dateYear}`;

    return (
        <div>
            <div className={'col-sm-8 col-md-8'}>
                <h5>{props.review.userEmail}</h5>
                <div className={'row'}>
                    <div className={'col'}>
                        {dateString}
                    </div>
                    <div className={'col'}>
                        <StarsReview rating={props.review.rating} size={16}/>
                    </div>
                </div>
                <div className={'mt-2'}>
                    <p>
                        {props.review.reviewDescription}
                    </p>
                </div>
            </div>
            <hr/>

        </div>
    );
}