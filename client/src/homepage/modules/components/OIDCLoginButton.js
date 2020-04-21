import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { isAuthed, loginUser, logoutUser} from '../../../lib/actions';
import Button from '../../modules/components/Button';
import _ from 'underscore'

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    overflow: 'hidden',
  }
});

class OIDCLoginButton extends Component {

    constructor(props) {
      super(props)
      this.onLoginClick = this.onLoginClick.bind(this);
    }

    // Fetch the list on first mount
    componentDidMount() {
      this.props.isAuthed()
      //this.props.performFileSearch();
    }

    onLoginClick() {
        if(this.props.state.isAuthed) {
            this.props.logoutUser();
        }else{
            this.props.loginUser();
        }
    }

    render() {
      
      return (
                <Button
                color="secondary"
                size="large"
                variant="contained"
                style={{marginBottom: 15}} 
                onClick={this.onLoginClick}
            >
                {'OIDC Login'}
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
  { isAuthed , loginUser, logoutUser}
)
(withStyles(styles)(OIDCLoginButton));

