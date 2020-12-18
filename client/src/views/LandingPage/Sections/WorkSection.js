import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button.js";

import styles from "../../../assets/jss/material-kit-react/views/landingPageSections/workStyle.js";

const useStyles = makeStyles(styles);

export default function WorkSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem style={{textAlign: "center"}} cs={12} sm={12} md={8}>
        <Button
          color="danger"
          size="lg"
          href="/pricing"
          rel="noopener noreferrer"
        >
          <i className="fas fa-play" />
          Get Started
        </Button>
        </GridItem>
      </GridContainer>
    </div>
  );
}
