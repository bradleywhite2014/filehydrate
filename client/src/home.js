import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { toggleMenu, closeMenu } from './lib/actions'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import Header from './containers/header.js'
import Menu from './components/menu'
import headerIcon from './assets/images/header_menu.svg'


class Home extends Component {

  constructor(props) {
    super(props);
  }

  handleHeaderToggle = (e) => {
    this.props.toggleMenu()
  };

  handleHeaderClose = event => {
    this.props.closeMenu()
  };


  render() {
    const {menuOpen} = this.props;
    return (
    <div className="app">
    <div className="opaque-overlay" />
    <Menu menuOpen={menuOpen} handleToggle={this.handleHeaderToggle} handleClose={this.handleHeaderClose} />  
      <h1 className="home_text">Upset City</h1>
      
    </div>
    );
  }
}
export default connect(
  (state) => ({
    reducer: state.reducer
  }),
  { toggleMenu, closeMenu }
)(Home)