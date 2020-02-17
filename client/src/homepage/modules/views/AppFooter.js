import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';

// function Copyright() {
//   return (
//     <React.Fragment>
//       {'© '}
//       <Typography variant="body2" color="inherit" >
//       Documerge
//       </Typography>{' '}
//       {new Date().getFullYear()}
//     </React.Fragment>
//   );
// }

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justify="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a href="" className={classes.icon} style={{backgorundColor: '#00b4f9', borderRadius: '5px'}}>
                  <img src={require("../../../assets/images/appFooterFacebook.png")} alt="Facebook" />
                </a>
                <a href="" className={classes.icon} style={{backgorundColor: '#00b4f9', borderRadius: '5px'}}>
                  <img src={require("../../../assets/images/appFooterTwitter.png")} alt="Twitter" />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
