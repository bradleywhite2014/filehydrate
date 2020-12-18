import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { parseTokens } from './../lib/actions';

class ImplicitCallback extends Component {

    constructor(props) {
      super(props)
    }

    // Fetch the list on first mount
    componentDidMount() {
      this.props.parseTokens()
      //this.props.performFileSearch();
    }

    render() {
      
      return (
                <React.Fragment />  
      )
  }
}


export default connect((state) => (
  {
    state: state
  }
),
  { parseTokens }
)
(ImplicitCallback);

