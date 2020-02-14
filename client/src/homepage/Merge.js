import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
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

      this.renderLabelAndField = this.renderLabelAndField.bind(this);
    }

    // Fetch the list on first mount
    componentDidMount() {
      this.props.fetchMergeFields()
    }

    renderLabelAndField() {
      this.props.state.mergeFields.forEach( (field) => {
        return <p>{field}</p>
      })
    }

    render() {
      
      return  (
        <section className={styles.root}>
        {this.props.state.mergeFields}
          <Container className={styles.container}>
            <img
              src={require("./../assets/images/productCurvyLines.png")}
              className={styles.curvyLines}
              alt="curvy lines"
            />
            <div>
              <Grid container spacing={5}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" align="center">
                    </Typography>
                </Grid>
              </Grid>
            </div>
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
