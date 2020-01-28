// src/App.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch , Redirect} from 'react-router-dom';
import Home from './home';
import Teams from './teams';
import Games from './games';
import {
  randomString
} from './utils'

import OktaAuth from '@okta/okta-auth-js'

var config = {
  domain: 'https://dev-192910.okta.com',
  issuer: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356',
  tokenManager: {
    storage: 'sessionStorage'
  },
  clientId: '0oadvtnnf927LpwaE356',
  redirectUri: window.location.origin + '/auth/callback',
  wellKnown: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356/.well-known/openid-configuration',
  authz_endpoint: 'https://dev-192910.okta.com/oauth2/ausdvtadl6vMkGVcj356/v1/authorize'
};

class App extends Component {
  constructor() {
    super()
    this.state = {
      authed: false
    }
    this.authClient = new OktaAuth({
      url: config.domain,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      issuer: config.issuer,
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'profile']

    })

    this.makeOidcUrl = this.makeOidcUrl.bind(this);
    this.attemptSSO = this.attemptSSO.bind(this);
    this.attemptSSO();
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

  async attemptSSO() {
    try{
      const session = await this.authClient.session.refresh();
      const response = await this.authClient.token.getWithoutPrompt({
        responseType: ['id_token', 'token'],
        sessionToken: session
      })
      sessionStorage.setItem('id_token', response[0].idToken)
      sessionStorage.setItem('access_token', response[1].accessToken)
      this.setState({authed: true})
    }catch(err){
      // dont have a valid session, send to okta
      window.location = this.makeOidcUrl();
    }
    
  }
  

  render() {
    const { teams, games, menuOpen } = this.props.reducer ? this.props.reducer : {teams: [], games: []};
    if(this.state.authed) {
      return (
        <Router>
            <Switch>
            <Route path='/' exact={true} render={(props) => <Home {...props} menuOpen={menuOpen}/>} />
            <Route path='/auth/callback' render={(props) => <Redirect to="/"/> }/>
            <Route 
                path="/teams" 
                render={(props) => <Teams {...props} teams={teams}/>} 
            />
            <Route 
                path="/games" 
                render={(props) => <Games {...props} games={games} menuOpen={menuOpen}/>} 
            />
            </Switch>
        </Router>
      );
    } else {
      return null;
    }
    
  }
}

export default connect(
  (state) => ({
    reducer: state
  }),
  {
  }
)(App)