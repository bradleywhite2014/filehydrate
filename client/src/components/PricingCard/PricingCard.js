import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import styles from "../../assets/jss/material-kit-react/components/cardStyle.js";

const useStyles = makeStyles(styles);

export default function PricingCard(props) {
  const classes = useStyles();
  const { amount,level, mergeCount, bulkFileAmount, teamMembers, className, children, plain, carousel, ...rest } = props;
  // const cardClasses = classNames({
  //   [classes.card]: true,
  //   [classes.cardPlain]: plain,
  //   [classes.cardCarousel]: carousel,
  //   [className]: className !== undefined
  // });
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
        <a href="#bradley" className="btn btn-white btn-raised btn-round pricing-btn">
          Get Started
        </a>
      </div>
    </div>
  );
}

