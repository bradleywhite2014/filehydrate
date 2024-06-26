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
        <div className="row">   
          <div className="col-md-1">
          </div>
          <div className="col-md-4">
            <PricingCard level="Basic" amount="9.99" mergeCount="10" bulkFileAmount="1" teamMembers="1"  />
          </div>
          <div className="col-md-2">
          </div>
          <div className="col-md-4">
              <PricingCard level="Professional" amount="25.00" mergeCount="500" bulkFileAmount="10" teamMembers="10" />
          </div>
          <div className="col-md-1">
          </div>
        </div>
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
