import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class Matchup extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {winner: ""};
    this.handleWinnerClick = this.handleWinnerClick.bind(this);
  }

  handleWinnerClick(started, rank, team, teamId, gameId) {
    if(!started){ 
      this.setState({winner: "#" + rank + " " + team});
      this.props.submitGamePick({
        team_id: teamId,
        game_id: gameId,
        byhowmuch: 10
      })
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    //this.props.getGames()
  }

  render() {
    const {team1rank, team2rank, team1, team2, team1Id, team2Id, gameId, started} = this.props;
    return (
      <>
        {started ? <h4 className="game-started"> Started </h4>: null}
        <div onClick={() => this.handleWinnerClick(started, team1rank, team1, team1Id, gameId)} className={("margin-left team_text" + " ") + (started === true ? "disabled" : "")}> {"#" + team1rank + " " + team1} </div>
        <div className="bracket-wrapper" >
          <div className="blk_line_right">
              <div className="blk_line margin-bottom">
              </div>
              <div className="blk_line">
              </div>
          </div>
          <div className="flex-col margin-right">
            <div className="team_winner_text">{this.state.winner}</div>
            <div className="blk_line middle">
          </div>
          </div>
        </div>
        <div onClick={() => this.handleWinnerClick(started, team2rank, team2, team2Id, gameId)} className={("margin-left team_text" + " ") + (started === true ? "disabled" : "")}> {"#" + team2rank + " " + team2} </div>
        </>
    );
  }
}
