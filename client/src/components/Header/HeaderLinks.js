/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import GoogleIcon from "../../components/GoogleIcon"
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown.js";
import Button from "../../components/CustomButtons/Button.js";

import styles from "../../assets/jss/material-kit-react/components/headerLinksStyle.js";

const googleScopes = 'https://www.googleapis.com/auth/drive.file email profile'
import { connect } from 'react-redux'
import {logoutUser, setUserInfo} from '../../lib/actions'
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(styles);
import * as firebase from 'firebase';
import firebaseConfig from '../../firebase.config'
firebase.initializeApp(firebaseConfig)


function HeaderLinks(props) {
  const history = useHistory();

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope(googleScopes)
    
    firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => { 
      firebase
      .auth()
      .signInWithRedirect(provider)
      .then(result => {
        //console.log(result)
        sessionStorage.setItem('filehydrate:accessToken', result.credential.accessToken);
        sessionStorage.setItem('filehydrate:idToken', result.credential.idToken);
        props.setUserInfo({name: result.user.displayName, imageUrl: result.user.photoURL, idToken: result.credential.idToken})
        //history.push('/merge')
        Auth.setLoggedIn(true)
      })
      .catch(e => console.log(e.message))
    })
  }

  return (
    <List >
      <ListItem >
      {props.state && props.state.authState === 'VALID' ? 
        <div id="customBtn" onClick={() => props.logoutUser()} className="customGPlusSignIn">
        <GoogleIcon key={1} style={{marginRight: '26px'}} />
        <div style={{height:'18px'}} className="buttonText">Logout of Google</div>
      </div>
        
      :
      <div id="customBtn" onClick={() => signInWithGoogle()} className="customGPlusSignIn">
        <GoogleIcon key={1} style={{marginRight: '26px'}} />
        <div style={{height:'18px'}} className="buttonText">Login With Google</div>
      </div>
      }
      </ListItem>
    </List>
  );
}


export default connect((state) => (
  {
    state: state
  }
),
  { logoutUser, setUserInfo}
)
(HeaderLinks);