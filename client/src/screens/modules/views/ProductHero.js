import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '../../../components/Button';
import Typography from '../../../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

import backgroundImg from '../../../assets/images/nature_background.svg';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImg})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <Typography style={{width: '35%', position: 'absolute', right: '40px'}} color="black" align="center" variant="h4" marked="center">
        Tired of filling out the same document over and over?
      </Typography>
      <br/>
      <Typography style={{width: '35%', position: 'absolute', right: '40px', marginTop: '120px'}} color="black" align="center" variant="h4">
        Let File Hydate do the work.
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
