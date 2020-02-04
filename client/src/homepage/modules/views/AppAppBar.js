import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import Typography from '../components/Typography';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { connect } from 'react-redux'
import { setUserInfo } from '../../../lib/actions'
import GoogleLogin from 'react-google-login';

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
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
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

function AppAppBar(props) {
  const { classes } = props;

  const responseGoogleSuccess = (response) => {
    //console.log('props: ' + JSON.stringify(props));
    console.log(response);
    props.setUserInfo(response);
  }
  
  const responseGoogleError = (response) => {
    console.log(response);
  }

  return props.state.userInfo.imageUrl.length > 0 ?  <div>
  <AppBar position="fixed">
    <Toolbar className={classes.toolbar}>
      <div className={classes.left} />
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        DocuMerge
      </Typography>
      <div className={classes.right}>
      <img src={props.state.userInfo.imageUrl} className={classes.profileIcon}/>
      <Typography color="inherit" align="center" variant="body2" className={classes.h4}>
        {props.state.userInfo.name}
      </Typography>
      </div>
    </Toolbar>
  </AppBar>
  <div className={classes.placeholder} />
</div> : (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
            DocuMerge
          </Typography>
          <div className={classes.right}>
          <GoogleLogin
            clientId="382267252700-gvhfvt7467hqlsuro9v4g7fc31v75q4h.apps.googleusercontent.com"
            buttonText="Login"
            scope={googleScopes}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleError}
            cookiePolicy={'single_host_origin'}
          />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect((state) => (
  {
    state: state
  }
),
  { setUserInfo }
)
(withStyles(styles)(AppAppBar));
