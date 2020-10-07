import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { checkAuthState, loginUser, logoutUser} from '../lib/actions';
import Button from '../components/Button';
import _ from 'underscore'
import GoogleIcon from './GoogleIcon'

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    overflow: 'hidden',
  }
});

const initialStyle = {
  backgroundColor: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  color: 'rgba(0, 0, 0, .54)',
  boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)',
  padding: '8px',
  borderRadius: 2,
  border: '1px solid transparent',
  fontSize: 14,
  fontWeight: '500',
  fontFamily: 'Roboto, sans-serif',
  textTransform: 'none',
}

const hoveredStyle = {
  cursor: 'pointer',
  opacity: 0.9
}

const activeStyle = {
  cursor: 'pointer',
  backgroundColor: '#eee',
  color: 'rgba(0, 0, 0, .54)',
  opacity: 1
}

const defaultStyle = (() => {
  // if (this.state.active) {
  //   return Object.assign({}, initialStyle, activeStyle)
  // }

  // if (this.state.hovered) {
  //   return Object.assign({}, initialStyle, hoveredStyle)
  // }

  return initialStyle
})

class OIDCLoginButton extends Component {

    constructor(props) {
      super(props)
      this.onLoginClick = this.onLoginClick.bind(this);
    }

    // Fetch the list on first mount
    componentDidMount() {
      
    }

    onLoginClick() {
        if(this.props.state.authState === 'VALID') {
            this.props.logoutUser();
        }else{
            this.props.loginUser({firebase: this.props.state.firebase, provider: this.props.state.provider});
        }
    }
//'Logout of Google'
    render() {
      
      return (  
                <Button
                color="secondary"
                size="large"
                variant="contained"
                style={defaultStyle()}
                onClick={this.onLoginClick}
            ><GoogleIcon key={1} style={{marginRight: '8px'}} />
                {this.props.state.authState === 'VALID' ? 'Logout of Google' : 'Sign in with Google'}
            </Button>  
      )  
  }
}

OIDCLoginButton.propTypes = {
};

export default connect((state) => (
  {
    state: state
  }
),
  { checkAuthState , loginUser, logoutUser}
)
(withStyles(styles)(OIDCLoginButton));

