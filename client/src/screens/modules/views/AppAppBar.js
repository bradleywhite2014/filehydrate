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
//1E5Us1TfM8QojOqgfe0-pdmSaw3VOFBK-jTIl6dziPcY

const googleScopes = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive email profile'



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
  }});

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
        <Link href="/" underline="none">
          File Hydrate
        </Link>
      </Typography>
      <div className={classes.right}>
      {props.state.userPhotoUrl ? <img src={props.state.userPhotoUrl} className={classes.profileIcon}/> : <React.Fragment /> }
      <button onClick={() => signInWithGoogle()} className="googleBtn" type="button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="logo"
        />
        Login With Google
      </button>
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
