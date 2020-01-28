import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from '@material-ui/core/Paper';
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Header from "../containers/header";
import headerIcon from "../assets/images/header_menu.svg";

export default class Menu extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange() {}

  // Fetch the list on first mount
  componentDidMount() {
    //this.props.getGames()
  }

  render() {
    const { handleToggle, handleClose, menuOpen } = this.props;
    return (
      <Header>
        <div>
          <img
            id="main-menu"
            onClick={handleToggle}
            className="menu-icon"
            src={headerIcon}
          />
          <Popper
            open={menuOpen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper className="nav-sidebar">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList>
                    <Link to={'./'}>
                      <MenuItem className="white" onClick={handleClose}>Admin</MenuItem>
                      </Link>
                    <Link to={'./'}>
                      <MenuItem className="white" onClick={handleClose}>Home</MenuItem>
                      </Link>
                      <Link to={'./games'}>
                      <MenuItem className="white" onClick={handleClose}>Make Picks</MenuItem>
                      </Link>
                      <Link to={'./games'}>
                      <MenuItem className="white" onClick={handleClose}>Table</MenuItem>
                      </Link>
                      <Link to={'./games'}>
                      <MenuItem className="white" onClick={handleClose}>Logout</MenuItem>
                      </Link>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Header>
    );
  }
}
