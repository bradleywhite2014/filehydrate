import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

// @material-ui/icons

// bkw components
import Merge from '../Merge'
import MiraklApiManagement from '../MiraklApiManagement'
import DataTableModal from '../../components/DataTableModal'
import ToastMessage from '../../components/ToastMessage'
import GlobalModal from '../../components/GlobalModal'

// core components
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Button from "../../components/CustomButtons/Button.js";
import HeaderLinks from "../../components/Header/HeaderLinks.js";
import Parallax from "../../components/Parallax/Parallax.js";

import styles from "../../assets/jss/material-kit-react/views/landingPage.js";


const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function APIMangagement(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <div>
        <Header
          color="dark"
          routes={dashboardRoutes}
          brand="File Hydrate"
          rightLinks={<HeaderLinks hideDashBtn={true} />}
          {...rest}
        />
      </div>
      <div>
        <div className={classes.main}>
          <div className={classes.container}>
            <MiraklApiManagement />
            <ToastMessage />
            <GlobalModal/>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
