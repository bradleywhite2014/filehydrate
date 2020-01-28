import React, {
  Component
} from 'react';

import {
  connect
} from 'react-redux'
import {
  withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

export default class Header extends Component {
  // Initialize the state
  constructor(props) {
    super(props)
    this.state = {}

  }

  handleChange() {

  }

  // Fetch the list on first mount
  componentDidMount() {
    //this.props.getGames()
  }

  render() {
    const {
      children
    } = this.props;
    return ( <div className = "header" >
      {children}
    </div>
    )
  }
}