import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from './modules/components/Typography';
import Toolbar, { styles as toolbarStyles } from './modules/components/Toolbar';
import { connect } from 'react-redux'
import { fetchMergeFields, updateMergeField, submitMergeFields } from './../lib/actions'
import ProductHeroLayout from './modules/views/ProductHeroLayout';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from './modules/components/Button';
import _ from 'underscore'

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginBottom: theme.spacing(14),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
    opacity: 0.7,
  },
  button: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
  },
});

class Merge extends Component {

    constructor(props) {
      super(props)
      this.onSubmit = this.onSubmit.bind(this);
      this.updateField = this.updateField.bind(this);
    }

    // Fetch the list on first mount
    componentDidMount() {
      //this.props.fetchMergeFields(this.props.docId)
    }

    updateField = (event, field) => {
      //console.log(field + " " + event.target.value);
      this.props.updateMergeField({
        fieldKey: field, 
        fieldVal: event.target.value
      });
    }

    onSubmit = () => {
      //console.log(this.props.state.formFields)
      //https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main
      this.props.submitMergeFields({docId: this.props.state.docId, formFields: this.props.state.formFields})
    }

    render() {
      
      return  (
        <section className={styles.root}>
          <Container className={styles.container}>
          {_.keys(this.props.state.formFields).map((field) => {
            return <TextField onChange={(event) => this.updateField(event, field)} style={{width: '-webkit-fill-available' , marginTop: 8, marginBottom: 8}} id="outlined-basic" label={field.substring(2,field.length - 2)} variant="outlined" />
          })}
          <Button
          color="secondary"
          size="large"
          variant="contained"
          style={{marginBottom: 15}} 
          onClick={this.onSubmit}
        >
          {'Submit'}
        </Button>
          </Container>
        </section>
      ); 
  }
}

Merge.propTypes = {
};

export default connect((state) => (
  {
    state: state
  }
),
  { fetchMergeFields , updateMergeField, submitMergeFields}
)
(withStyles(styles)(Merge));
