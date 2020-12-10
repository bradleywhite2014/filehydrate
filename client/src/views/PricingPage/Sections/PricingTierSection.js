import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import GetApp from "@material-ui/icons/GetApp";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
import MergeType from "@material-ui/icons/MergeType";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import PricingCard from "../../../components/PricingCard/PricingCard.js";
import GridItem from "../../../components/Grid/GridItem.js";
import InfoArea from "../../../components/InfoArea/InfoArea.js";

import styles from "../../../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

import { connect } from 'react-redux'
import {resetCheckout} from '../../../lib/actions'

import ReactDOM from 'react-dom';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const getClientSecret = () => {
  return 'cus_IVxm3YK1YImYLA_secret_sk_test_51Haz1VAt5lSr2FnXyrDAZU1KTCB7K1Zsl6am2FTBTFZiwkmtQqpMZO6GG9Bc4by6gBTm8QzECcvRgDWUjN9Wltrq00MLLGIiUz';
}

const CheckoutForm = () => {
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);
    const clientSecret = getClientSecret();
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "B Dub",
        },
      },
    });
    setPaymentLoading(false);
    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Success!");
      }
    }
  };

  return (
    <div
      style={{
        padding: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <form
          style={{
            display: "block",
            width: "100%",
          }}
          onSubmit = {payMoney}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardElement
              className="card-payment"
              options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  } 
                },
              }}
            />
            <button
              className="pay-button"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Loading..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const stripePromise = loadStripe('pk_test_51Haz1VAt5lSr2FnXP2rNSAJ4ONL8LcfWt7cdhplJ4rO55TM2H3uS3MlnXSia6Bh06SQ6ckMQeVX3bSjstnC27Uv60083wJIIfA');


function PricingTierSection(props) {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center" style={{marginBottom: "15px"}}>
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Let{"'"}s talk numbers</h2>
          <h5 className={classes.description}>
            Getting started is easier than ever. Simply start with a free tier to test
            the product, and then easily upgrade to a size that fits your business needs later.
          </h5>
        </GridItem>
      </GridContainer>
      
      {
        !props.state.checkoutScreen ?
        <div className="row">   
          <div className="col-md-4">
            <PricingCard level="Basic" amount="FREE" mergeCount="10" bulkFileAmount="1" teamMembers="1"  />
          </div>
          <div className="col-md-4">
              <PricingCard level="Professional" amount="9.99" mergeCount="500" bulkFileAmount="10" teamMembers="10" />
          </div>
          <div className="col-md-4">
              <PricingCard level="Enterprise" amount="49.99" mergeCount="Unlimited" bulkFileAmount="50" teamMembers="500" />
          </div>
        </div>
      : 
      <GridContainer justify="center" style={{marginBottom: "15px"}}>
        <GridItem xs={12} sm={12} md={8}>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </GridItem>
      </GridContainer>
      }
    </div>
  );
}

export default connect((state) => (
  {
    state: state
  }
),
  { resetCheckout }
)
((PricingTierSection));
