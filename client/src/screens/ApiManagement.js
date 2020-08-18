import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'
import { updateMiraklToken, updateMiraklUrl, submitMiraklHostAndToken} from './../lib/actions'
import Button from '../components/Button';
import _ from 'underscore'
import ReactGA from 'react-ga';
import Typography from '../components/Typography';

class ApiManagement extends Component {

    constructor(props) {
      super(props)
      this.updateMiraklToken = this.updateMiraklToken.bind(this);
      this.updateMiraklUrl = this.updateMiraklUrl.bind(this);
      this.onSaveInfo = this.onSaveInfo.bind(this);

      ReactGA.initialize('UA-163141688-1');
    }

    // Fetch the list on first mount
    componentDidMount() {;
      ReactGA.event({
        category: 'User',
        action: 'Entered Api Management Page'
      });
    }

    updateMiraklToken(event) {
      this.props.updateMiraklToken(event.currentTarget.value);
    }

    updateMiraklUrl(event) {
      this.props.updateMiraklUrl(event.currentTarget.value);
    }

    onSaveInfo(event) {
      this.props.submitMiraklHostAndToken({userDetails: {url: this.props.state.miraklUrlHost, token: this.props.state.miraklApiToken}});
    }

    render() {
      
      return (
        <div style={{margin: '32px'}}>
        <Typography variant="h4" marked="center" component="h2">
          Mirakl Configuration
        </Typography>
            <TextField key={'miraklUrl'} onChange={(event) => this.updateMiraklUrl(event)} style={{width: '-webkit-fill-available' , marginTop: 8, marginBottom: 8, background: 'white'}} label={"Mirakl Host URL"} variant="outlined" />
              <TextField key={'miraklTok'} onChange={(event) => this.updateMiraklToken(event)} style={{width: '-webkit-fill-available' , marginTop: 8, marginBottom: 8, background: 'white'}} label={"Mirakl API Token"} variant="outlined" />  
              <Button
                color="secondary"
                size="large"
                variant="contained"
                style={{marginBottom: 15, marginRight: 15}} 
              >
                {'Save'}
              </Button>
        </div>
      )
  }
}

ApiManagement.propTypes = {
};

export default connect((state) => (
  {
    state: state
  }
),
  { updateMiraklToken, updateMiraklUrl, submitMiraklHostAndToken}
)
(ApiManagement);
