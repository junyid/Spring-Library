import {useOktaAuth} from "@okta/okta-react";
import React, {useEffect, useState} from "react";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Link} from "react-router-dom";
import PaymentInfoRequest from "../../Models/PaymentInfoRequest";

export const PaymentPage = () => {

    const {authState} = useOktaAuth();
    const [error, setError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const paymentResponse = await fetch(url, options);
                if (!paymentResponse.ok) {
                    throw new Error('Error fetching payment info');
                }
                const paymentResponseJson = await paymentResponse.json();
                setFees(paymentResponseJson.amount);
                setLoadingFees(false);
            }
        }
        fetchFees().catch(err => {
            setError(err.message);
            setLoadingFees(false);
        });
    }, [authState]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), 'USD', authState?.accessToken?.claims.sub);
        const url = `${process.env.REACT_APP_API}/payment/secure/payment-intent`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
            },
            body: JSON.stringify(paymentInfo)
        }
        const stripeResponse = await fetch(url, options);
        if (!stripeResponse.ok) {
            setError(true);
            setSubmitDisabled(false);
            throw new Error('Error processing payment');
        }

        const stripeResponseJson = await stripeResponse.json();

        stripe.confirmCardPayment(stripeResponseJson.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    name: authState?.accessToken?.claims.sub
                }
            }
        }, {handleActions: false}).then(async function (result: any) {
            if (result.error) {
                setSubmitDisabled(false);
                alert(result.error.message);
            } else {
                const url = `${process.env.REACT_APP_API}/payment/secure/payment-complete`;
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                    }
                }

                const stripeResponse = await fetch(url, options);
                if (!stripeResponse.ok) {
                    setError(true);
                    setSubmitDisabled(false);
                    throw new Error('Error processing payment');
                }
                setFees(0);
                setSubmitDisabled(false);
            }
        });
        setError(false);
    }


    if (loadingFees) {
        return <SpinnerLoading/>
    }

    if (error) {
        return (
            <div className={'container m-5'}>
                <p>{error}</p>
            </div>
        )
    }


    return (
        <div className={'container'}>
            {fees > 0 && <div className={'card mt-3'}>
                <h5 className={'card-header'}>Fees pending: <span className={'text-danger'}>${fees}</span></h5>
                <div className={'card-body'}>
                    <h5 className={'card-title mb-3'}>Credit Card</h5>
                    <CardElement id={'card-element'}/>
                    <button disabled={submitDisabled} className={'btn btn-md main-color text-white mt-3'}
                            onClick={checkout}>Pay fees
                    </button>
                </div>
            </div>}

            {fees === 0 && <div className={'mt-3'}>
                <h5>No pending fees.</h5>
                <Link type={'button'} className={'btn main-color text-white'} to={'search'}>
                    Explore top books
                </Link>
            </div>}
            {submitDisabled && <SpinnerLoading/>}
        </div>

    );
}