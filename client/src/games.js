import React, { Component } from 'react';

import { connect } from 'react-redux'
import { getGames, toggleMenu, closeMenu, makePick, getCurrentRound } from './lib/actions'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import Menu from './components/menu'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import Header from './containers/header.js';
import Matchup from './components/matchup';

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

class Games extends Component {
  // Initialize the state
  constructor(props) {
    super(props)
    this.state = {}
    this.makePick = this.makePick.bind(this);
  }

  handleChange() {
    
  }

  makePick = pick => {
    this.props.makePick(pick);
  }

  handleHeaderToggle = (e) => {
    this.props.toggleMenu()
  };

  handleHeaderClose = event => {
    this.props.closeMenu()
  };

  // Fetch the list on first mount
  async componentDidMount() {
    await this.props.getCurrentRound()
    this.props.getGames()
  }

  render() {
    const {games, menuOpen} = this.props;
    console.log(this.props)
    return (
      <div className="games">
        <Menu menuOpen={menuOpen} handleToggle={this.handleHeaderToggle} handleClose={this.handleHeaderClose} />   
        {games.length ? (
          <>
            <h2 className="margin-left">Make your picks!</h2>
            <h4 className="margin-left">Warning: Changes will not be allowed once a game has started.</h4>
            <div className="margin-left">
              {/* Render the teams of items {"#" + item.team_one_rank + " " + item.team_one_name} */}
              {games.map((item) => {
                return(
                    <Matchup submitGamePick={(pick) => this.makePick(pick)} started={item.started} gameId={item.game_id} team1={item.team_one_name} team1Id={item.team_one_id} team2Id={item.team_two_id} team2={item.team_two_name} team1rank={item.team_one_rank} team2rank={item.team_two_rank} />
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <h2>No games Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default connect(
  (state) => ({
    reducer: state.reducer
  }),
  { getGames, toggleMenu, closeMenu, makePick, getCurrentRound }
)(Games)
