import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../../../components/AppBar';
import Typography from '../../../components/Typography';
import Toolbar, { styles as toolbarStyles } from '../../../components/Toolbar';
import { connect } from 'react-redux'
import {logoutUser, setUserInfo} from '../../../lib/actions'
import { useHistory } from "react-router-dom";
import OIDCLoginButton from '../../../components/OIDCLoginButton';
import {NavHamburger} from '../../../components/NavHamburger';
import GoogleIcon from '../../../components/GoogleIcon'
const googleScopes = 'https://www.googleapis.com/auth/drive.file email profile'



const styles = theme => ({
  title: {
    fontSize: 24,
    color: 'fff !important',
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: '#FFF',
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rightLink: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  profileIcon: {
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    marginRight: '10px'
  },
  customBtn: {
    display: 'inline-block',
    background: 'white',
    color: '#444',
    width: '190px',
    borderRadius: '5px',
    border: 'thin solid #888',
    boxShadow: '1px 1px 1px grey',
    whiteSpace: 'nowrap',
  },
  customBtn_hover: {
    cursor: 'pointer',
  },
  span_label: {
    fontFamily: 'serif',
    fontWeight: 'normal',
  },
  span_icon: {
    backgorund:'transparent 5px 50% no-repeat',
    display: 'inline-block',
    verticalSlign: 'middle',
    width: '42px',
    height: '42px',
  },
  span_buttonText: {
    display: 'inline-block',
    verticalAlign: 'middle',
    paddingLeft: '42px',
    paddingRight: '42px',
    fontSize: '14px',
    fontWeight: 'bold',
    /* Use the Roboto font that is loaded in the <head> */
    fontFamily: 'Roboto sans-serif'
  }
});

import * as firebase from 'firebase';
import firebaseConfig from '../../../firebase.config'
firebase.initializeApp(firebaseConfig)

function AppAppBar(props) {
  const history = useHistory();
  const { classes } = props; 

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope(googleScopes)
    
    firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => { 
      firebase
      .auth()
      .signInWithPopup(provider)
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

  
  return <div>
    <NavHamburger history={history}/>
  <AppBar position="fixed" style={{zIndex: '10'}}>
    <Toolbar className={classes.toolbar}>
      <div className={classes.left} />
      <Typography align="center" variant="body2" className={classes.h4}>
        <Link style={{color: 'white', fontFamily: 'cursive', fontSize:'26px'}} href="/" underline="none">
          File Hydrate
        </Link>
      </Typography>
      <div className={classes.right}>
      {props.state.userInfo.imageUrl ? <img src={props.state.userInfo.imageUrl} className={classes.profileIcon}/> : <React.Fragment /> }
      
      {props.state.authState === 'VALID' ? 
        <div id="customBtn" onClick={() => props.logoutUser()} class="customGPlusSignIn">
        <GoogleIcon key={1} style={{marginRight: '26px'}} />
        <div style={{height:'18px'}} class="buttonText">Logout of Google</div>
      </div>
        
      :
      <div id="customBtn" onClick={() => signInWithGoogle()} class="customGPlusSignIn">
        <GoogleIcon key={1} style={{marginRight: '26px'}} />
        <div style={{height:'18px'}} class="buttonText">Login With Google</div>
      </div>
      }
      
      </div>
    </Toolbar>
  </AppBar>
  <div className={classes.placeholder} />
</div>;
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect((state) => (
  {
    state: state
  }
),
  { logoutUser, setUserInfo}
)
(withStyles(styles)(AppAppBar));
