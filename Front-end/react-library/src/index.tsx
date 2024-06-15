import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const stripePromise =
    loadStripe('pk_test_51PRoslJUKHvPjWUZI002OQwD7XAdCpQEMJLjhdpEXj2NNvi4DftuDGSlp8a9Wm85Wy9PDktFe9Jb6YuhTguGzvND00yyZTugkr');


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Elements stripe={stripePromise}>
            <App/>
        </Elements>
    </BrowserRouter>
);
