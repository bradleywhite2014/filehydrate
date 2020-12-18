/*eslint-disable*/
import React, { Component } from 'react';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link, useHistory, withRouter } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import GoogleIcon from "../../components/GoogleIcon"
import GoogleButton from 'react-google-button'
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown.js";
import Button from "../../components/CustomButtons/Button.js";

import styles from "../../assets/jss/material-kit-react/components/headerLinksStyle.js";

const googleScopes = 'https://www.googleapis.com/auth/drive.file email profile'
import { connect } from 'react-redux'
import {logoutUser, setUserInfo, checkAuthState, findOrCreateUserSubStatus} from '../../lib/actions'
const useStyles = makeStyles(styles);
import * as firebase from 'firebase';
import firebaseConfig from '../../firebase.config'
firebase.initializeApp(firebaseConfig)


var publishableKey = 'pk_test_51Haz1VAt5lSr2FnXP2rNSAJ4ONL8LcfWt7cdhplJ4rO55TM2H3uS3MlnXSia6Bh06SQ6ckMQeVX3bSjstnC27Uv60083wJIIfA';
import {Stripe} from 'stripe';
const stripe = new Stripe(publishableKey, {
  apiVersion: '2020-08-27',
});



class HeaderLinks extends Component {

  constructor(props) {
    super(props)
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
  }
  

  componentDidMount = () => {
    this.props.checkAuthState();
    if(this.props.state.userInfo.uid){
      this.props.findOrCreateUserSubStatus(this.props.state.userInfo.uid);
    }
    
  }
  

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope(googleScopes)
    
    firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => { 
      firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        //console.log(result)
        let user = result.user;
        sessionStorage.setItem('filehydrate:accessToken', result.credential.accessToken);
        sessionStorage.setItem('filehydrate:idToken', result.credential.idToken);
        this.props.setUserInfo({name: result.user.displayName, imageUrl: result.user.photoURL, idToken: result.credential.idToken, uid: user.uid})
        
        this.props.findOrCreateUserSubStatus(user.uid);

        Auth.setLoggedIn(true) 
      })
      .catch(e => console.log(e.message))
    })
  }

  render() {
    const { history, hideDashBtn } = this.props;
    return (
      <List style={{'display': 'flex'}} >
        {
          !hideDashBtn && this.props.state.sub_status && this.props.state.sub_status === 'active' ?
          <ListItem>
          <Button
              color="danger"
              size="lg"
              rel="noopener noreferrer"
              onClick={() => {history.push('/merge')}}
            >
              <i className="fas fa-play" />
              Go to Dashboard
            </Button>
          </ListItem>
          : 
          <React.Fragment></React.Fragment>
        }
        <ListItem >
        {this.props.state && this.props.state.authState === 'VALID' ? 
        <GoogleButton
          label='Logout of Google'
          style={{cursor: 'pointer'}}
          onClick={() => this.props.logoutUser()}
        />        
        :
        <GoogleButton
          style={{cursor: 'pointer'}}
          onClick={() => this.signInWithGoogle()}
        />
        }
        </ListItem>
      </List>
    );
  }
}


export default withRouter(connect((state) => (
  {
    state: state
  }
),
  { logoutUser, setUserInfo, checkAuthState, findOrCreateUserSubStatus}
)
(HeaderLinks));