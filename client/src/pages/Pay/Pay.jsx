import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { axiosFetch } from '../../utils';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';
import './Pay.scss';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Pay = () => {
  const { _id } = useParams();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosFetch.post(`/orders/create-payment-intent/${_id}`);
        console.log('Payment Intent Data:', data); // Log the response data
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error.response); // Log the error response
      }
    })();
    window.scrollTo(0, 0);
  }, [_id]);

  const makePayment = async () => {
    try {
      const stripe = await stripePromise;
      const res = await axiosFetch.post('/orders/create-payment-intent', {
        gigId: _id,
      });

      await stripe.redirectToCheckout({
        sessionId: res.data.stripeSession.id,
      });
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
    }
  };

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className='pay'>
      <h2>Pay Securely with Stripe</h2>
      
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default Pay;