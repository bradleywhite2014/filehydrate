import React, { Component } from 'react';

import { connect } from 'react-redux'
import { getTeams } from './lib/actions'

class Teams extends Component {
  // Initialize the state
  constructor(props) {
    super(props)
    this.state = {teams: []}

  }

  handleChange() {
    
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.props.getTeams()
  }

  render() {
    const {teams} = this.props;
    return (
      <div className="App">
        <h1>Teams</h1>
        {/* Check to see if any items are found*/}
        {teams.length ? (
          <div>
            {/* Render the teams of items */}
            {teams.map((item) => {
              return(
                <div key={item.team_name}>
                  {item.rank + " " + item.team_name}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No teams Found</h2>
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
  { getTeams }
)(Teams)
