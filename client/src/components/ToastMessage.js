import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import {removeMessage} from '../lib/actions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import _ from 'underscore';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  close: {
    padding: theme.spacing(0.5),
  },
});

class ToastMessage extends Component {

  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    
  }

  handleClose = (event, msg) => {
    this.props.removeMessage(msg)
  };

  renderMessage(id, type, message, handleClose) {
    return (
      <div styles={{width: '100%', }}>
        <Snackbar
          key={id}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          severity="success"
          open={true}
          autoHideDuration={60000}
          onClose={(event) => this.handleClose(event, id)}
          message={message}
          action={
            <React.Fragment>
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={(event) => this.handleClose(event, id)}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  };

  render() {
      
    return  (
      <React.Fragment>
        {_.map(this.props.state.messages, (msg) => {
          return this.renderMessage(msg.id,msg.type,msg.message, this.handleClose)
        })}
        </React.Fragment>
    ); 
  }
  
}

export default connect((state) => (
  {
    state: state
  }
),
  { removeMessage }
)
(withStyles(styles)(ToastMessage));