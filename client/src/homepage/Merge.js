import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from './modules/components/Typography';
import Toolbar, { styles as toolbarStyles } from './modules/components/Toolbar';
import { connect } from 'react-redux'
import { fetchMergeFields } from './../lib/actions'
import ProductHeroLayout from './modules/views/ProductHeroLayout';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

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
  },
});

class Merge extends Component {

    constructor(props) {
      super(props)

    }

    // Fetch the list on first mount
    componentDidMount() {
      //this.props.fetchMergeFields()
    }


    render() {
      
      return  (
        <section className={styles.root}>
        
        
          <Container className={styles.container}>
          {this.props.state.mergeFields.map((field) => {
            return <TextField style={{width: '-webkit-fill-available' , marginTop: 15, marginBottom: 15}} id="outlined-basic" label={field.substring(2,field.length - 2)} variant="outlined" />
          })}
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
  { fetchMergeFields }
)
(withStyles(styles)(Merge));
