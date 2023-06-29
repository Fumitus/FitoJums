import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51NM6kLHBRELlE7pksp0OQmEONrBLX87sOUXICzqaxxbYYOg0LcrFKmxj7Bg0i0CFElieqvfXqDeaTJL5g78OfqMQ00HJZ3jPla'
);

export const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from an API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
