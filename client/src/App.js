// src/App.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch , Redirect} from 'react-router-dom';
import {
  randomString
} from './utils'

var config = {
  domain: 'https://dev-192910.okta.com',
  issuer: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356',
  tokenManager: {
    storage: 'sessionStorage'
  },
  clientId: '0oadvtnnf927LpwaE356',
  redirectUri: window.origin + '/auth/callback',
  wellKnown: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356/.well-known/openid-configuration',
  authz_endpoint: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356/v1/authorize'
};

class App extends Component {
  constructor() {
    super()
  }

  makeOidcUrl() {
    try{
      const authorization_endpoint = config.authz_endpoint;
      const url = new URL(authorization_endpoint);
      url.searchParams.append('client_id', config.clientId);
      url.searchParams.append('redirect_uri',config.redirectUri);
      url.searchParams.append('scope', 'openid profile');
      url.searchParams.append('response_type', 'id_token token');
      url.searchParams.append('state', '.')
      url.searchParams.append('nonce', randomString(32));
      return url;
    } catch(err){
      console.log(err)
      throw new Error('Sorry, cant connect to OIDC meta');
    }
  }
  

  render() {
    const { teams, games, menuOpen } = this.props.reducer ? this.props.reducer : {teams: [], games: []};
      return (
        <Router>
            <Switch>
            <Route path='/' exact={true} render={(props) => <div/>} />
            </Switch>
        </Router>
      );
    } 
}

export default connect(
  (state) => ({
    reducer: state
  }),
  {
  }
)(App)