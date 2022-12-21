import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51M0efuBy4k0O6hiSSx6hUIONhiSMXggdXd1Et5XZl4hmYCjCD8yAlImGWx5UqDDQ9iFOAsrN7QHH1Yl0sEW8H7oW00OJl7Zx09";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}
