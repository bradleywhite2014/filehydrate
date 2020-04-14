import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from './modules/components/Typography';
import Toolbar, { styles as toolbarStyles } from './modules/components/Toolbar';
import { connect } from 'react-redux'
import { setFileId, performFileSearch, fetchMergeFields } from './../lib/actions'
import ProductHeroLayout from './modules/views/ProductHeroLayout';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AutoComplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from './modules/components/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Merge from './Merge'
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
  },
  card: {
    boxShadow: "1px 1px 8px 1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);"
  }
});

class FileSelect extends Component {

    constructor(props) {
      super(props)
      this.updateFileId = this.updateFileId.bind(this);
      this.onUpdateInput = this.onUpdateInput.bind(this);
      this.selectFile = this.selectFile.bind(this);
    }

    // Fetch the list on first mount
    componentDidMount() {
      //this.props.fetchMergeFields()
      //this.props.performFileSearch();
    }

    updateFileId = (event, value) => {
      //console.log(field + " " + event.target.value);
      this.props.setFileId(value);
    }

    selectFile(event, inputValue, reason) {
      if(reason === 'select-option') {
        this.props.setFileId(inputValue.value);
        this.props.fetchMergeFields(inputValue.value);
      }
    }

    onUpdateInput(event, inputValue, reason) {
      this.props.performFileSearch(inputValue);
      //this.props.setFileText(inputValue)
      //          <TextField onChange={(event) => this.updateFileId(event, event.target.value)} style={{width: '-webkit-fill-available' , marginTop: 15, marginBottom: 15}} id="outlined-basic" label={'Enter Document ID'} variant="outlined" />
    //   <Button
    //   color="secondary"
    //   size="large"
    //   variant="contained"
    //   href="/merge"
    //   disabled={this.props.state.docId.length < 1}
    // >
    //   {'Load...'}
    // </Button>
    }

    render() {
      
      return (
        <section className={styles.root}>
          <Container className={styles.container}>
          
          <AutoComplete
            id="tags-standard"
            options={this.props.state.fileList}
            getOptionLabel={(option) => option.label}
            onChange={this.selectFile}
            onInputChange={this.onUpdateInput} 
            style={{marginTop: "16px"}}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="File Search"
                placeholder="Type to search..."
              />
            )}
          />
         { this.props.state.docId ?
        <div style={{marginTop: "36px", marginBottom: "8px"}}>
        <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
            <Card elevation={5}>
              <CardContent>
                {
                  this.props.state.loadingFields ? (
                    <React.Fragment>
                      <Skeleton animation="wave" height={60} />
                      <Skeleton animation="wave" height={600} />
                    </React.Fragment>
                  ) : (
                    <iframe id="viewer" src={"https://docs.google.com/document/d/" + this.props.state.docId + "/preview"} style={{width: "100%", height: "700px" ,marginTop: "15px"}}></iframe>
                  )
                }
              </CardContent>
            </Card>
              
            </Grid>
            <Grid item xs={12} md={6}>
            <Card elevation={5}>
            <Merge docId={this.props.state.docId} />
              </Card>
            </Grid>
          </Grid>
        </div>
        :
        <div style={{marginTop: "36px", marginBottom: "8px"}}>
        <Typography style={{marginTop: "8px"}} variant="h5" marked="center" component="h2">
            Please select a document...
          </Typography>
        </div>
      }
        
          </Container>
        </section>
      )
  }
}

FileSelect.propTypes = {
};

export default connect((state) => (
  {
    state: state
  }
),
  { setFileId , performFileSearch, fetchMergeFields}
)
(withStyles(styles)(FileSelect));
