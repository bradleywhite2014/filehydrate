import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import Typography from '../components/Typography';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { connect } from 'react-redux'
import { setUserInfo , logoutUser} from '../../../lib/actions'
import { useHistory } from "react-router-dom";
import OIDCLoginButton from '../components/OIDCLoginButton';
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

function AppAppBar(props) {
  const history = useHistory();
  const { classes } = props; 

  const responseGoogleSuccess = (response) => {
    //console.log('props: ' + JSON.stringify(props));
    props.setUserInfo(response);
  }

  const responseGoogleLogout = (response) => {
    props.logoutUser();
    history.push("/");
  }
  
  const responseGoogleError = (response) => {
    console.log(response);
  }
  return <div>
  <AppBar position="fixed">
    <Toolbar className={classes.toolbar}>
      <div className={classes.left} />
      <Typography align="center" variant="body2" className={classes.h4}>
        <Link href="/" underline="none">
          DocuMerge
        </Link>
      </Typography>
      <div className={classes.right}>
      <img src={props.state.userInfo.imageUrl} className={classes.profileIcon}/>
      <OIDCLoginButton />
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
  { setUserInfo , logoutUser}
)
(withStyles(styles)(AppAppBar));
