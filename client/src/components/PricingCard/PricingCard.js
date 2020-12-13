import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { connect } from 'react-redux';
import {kickoffCheckout} from '../../lib/actions';

// core components
import styles from "../../assets/jss/material-kit-react/components/cardStyle.js";

const useStyles = makeStyles(styles);

// If a fetch error occurs, log it to the console and show it in the UI.
const handleFetchResult = function(result) {
  if (!result.ok) {
    return result.json().then(function(json) {
      if (json.error && json.error.message) {
        throw new Error(result.url + ' ' + result.status + ' ' + json.error.message);
      }
    }).catch(function(err) {
      showErrorMessage(err);
      throw err;
    });
  }
  return result.json();
};

// Create a Checkout Session with the selected plan ID
const createCheckoutSession = function(priceId) {
  return fetch("https://yk39zpa2ae.execute-api.us-east-2.amazonaws.com/main/checkout_session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      priceId: priceId
    })
  }).then(handleFetchResult);
};

// Handle any errors returned from Checkout
const handleResult = function(result) {
  if (result.error) {
    showErrorMessage(result.error.message);
  }
};

const showErrorMessage = function(message) {
  var errorEl = document.getElementById("error-message")
  errorEl.textContent = message;
  errorEl.style.display = "block";
};


var publishableKey = 'pk_test_51Haz1VAt5lSr2FnXP2rNSAJ4ONL8LcfWt7cdhplJ4rO55TM2H3uS3MlnXSia6Bh06SQ6ckMQeVX3bSjstnC27Uv60083wJIIfA';
var basicPriceId = 'price_1Hx5UPAt5lSr2FnXhU7HmFxG';
var proPriceId = 'price_1Hx5RjAt5lSr2FnXLve6p3YP';

var stripe = Stripe(publishableKey);

function PricingCard(props) {
  const classes = useStyles();
  const { amount,level, mergeCount, bulkFileAmount, teamMembers, className, children, plain, carousel, ...rest } = props;
  return (
    <div className={`card card-pricing `}>
      <div className="content-rose">
        <h6 className="category">{level}</h6>
        {amount !== 'FREE' ? 
        <h1 className="card-title"><small>$</small>{amount}<small>/mo</small></h1>
        :
        <h1 className="card-title"><small>$</small>{amount}</h1>
        }
        <ul>
          <li><b>{teamMembers}</b> Team Members</li>
          <li><b>{bulkFileAmount}</b> Bulk File Amount</li>
          <li><b>{mergeCount}</b> Total Merges per Month</li>
        </ul>
        <button style={{cursor: 'button'}} onClick={
          (event) =>  {
            event.preventDefault();
            switch(level){
              case "Basic": {
                createCheckoutSession(basicPriceId).then(function(data) {
                  // Call Stripe.js method to redirect to the new Checkout page
                  stripe
                    .redirectToCheckout({
                      sessionId: data.sessionId
                    })
                    .then(handleResult);
                });
                
              }
              case "Professional": {
                createCheckoutSession(proPriceId).then(function(data) {
                  // Call Stripe.js method to redirect to the new Checkout page
                  stripe
                    .redirectToCheckout({
                      sessionId: data.sessionId
                    })
                    .then(handleResult);
                });
                
              }
            } 
            
              props.kickoffCheckout(level)
            }
          } className="btn btn-white btn-raised btn-round pricing-btn">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default connect((state) => (
  {
    state: state
  }
),
  { kickoffCheckout }
)
((PricingCard));

