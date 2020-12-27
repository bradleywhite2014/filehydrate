import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '../components/Typography';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { connect } from 'react-redux'
import { setFileId, performFileSearch, fetchMergeFields , changeMergeStyle, getMiraklTokenStatus, searchMiraklOrders, submitMergeFields,submitUserTemplate, loadUserTemplateForFile, setModalInfo,showModal, onTagClick, onTableClick, createBlankGoogleDoc, updateDocTemplateName} from './../lib/actions'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AutoComplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from "../components/CustomButtons/Button.js";

import SearchDataTable from '../components/SearchDataTable'
import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Merge from './Merge'
import _ from 'underscore'
import ReactGA from 'react-ga';

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
  container_horizontal: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
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

class TemplateCreation extends Component {

    constructor(props) {
      super(props)
      this.updateFileId = this.updateFileId.bind(this);
      this.onUpdateInput = this.onUpdateInput.bind(this);
      this.selectFile = this.selectFile.bind(this);
      this.changeMergeStyle = this.changeMergeStyle.bind(this);
      this.onSaveTemplate = this.onSaveTemplate.bind(this);
      this.onLoadTemplate = this.onLoadTemplate.bind(this);
      this.onSearchMirakl = this.onSearchMirakl.bind(this);
      this.onClickCreateDoc = this.onClickCreateDoc.bind(this);
      this.updateTemplateName = this.updateTemplateName.bind(this);

      ReactGA.initialize('UA-163141688-1');
    }

    // Fetch the list on first mount
    componentDidMount() {
      //this.props.fetchMergeFields()
      //this.props.performFileSearch();
      this.props.getMiraklTokenStatus();
      if(this.props.state.storedMiraklTokens && this.props.state.docId && this.props.state.mergeStyle === 'mirakl'){
        this.props.searchMiraklOrders();
      }
      ReactGA.event({
        category: 'User',
        action: 'Entered File Select Page'
      });
    }

    onClickCreateDoc = () => {
      this.props.createBlankGoogleDoc(this.props.state.docTemplateNameInput);
    }

    updateFileId = (event, value) => {
      //console.log(field + " " + event.target.value);
      this.props.setFileId(value);
    }

    selectFile(event, inputValue, reason) {
      if(reason === 'select-option') {
        this.props.setFileId(inputValue.value);
        if(this.props.state.storedMiraklTokens){
          this.props.searchMiraklOrders(inputValue.value);
        }
        this.props.fetchMergeFields(inputValue.value);

        ReactGA.event({
          category: 'User',
          action: 'File Selected'
        });
      }
    }

    onUpdateInput(event, inputValue, reason) {
      this.props.performFileSearch(inputValue);
    }

    changeMergeStyle(event) {
      if(event.currentTarget.value === 'mirakl'){
        this.props.getMiraklTokenStatus();
        if(this.props.state.storedMiraklTokens && this.props.state.docId){
          this.props.searchMiraklOrders();
        }
      }
      this.props.changeMergeStyle(event.currentTarget.value);
    }

    onSaveTemplate(event) {
      this.props.submitUserTemplate({userDetails: {docId: this.props.state.docId, formFields: this.props.state.mappingFields}});
    }

    onLoadTemplate(event) {
      this.props.loadUserTemplateForFile(this.props.state.docId);
    }

    onSearchMirakl(event) {
      this.props.searchMiraklOrders()
    }

    updateTemplateName(event) {
      this.props.updateDocTemplateName(event.target.value);
    }

    render() {
      
      return (
        <section className={styles.root}>
          <Container className={styles.container}>
            <Container className={styles.container_horizontal}>
              <TextField onChange={(event) => this.updateTemplateName(event)} style={{width: '-webkit-fill-available' , marginTop: 8, marginBottom: 8}} label={'Template Name'} variant="outlined" />
              <Button
                  color="danger"
                  size="lg"
                  rel="noopener noreferrer"
                  onClick={this.onClickCreateDoc}
                  disabled={!this.props.state.docTemplateNameInput}
                >
                  <i className="fas fa-play" />
                  Create New Template
                </Button>
                {
                  this.props.state.docId ?
                    <a style={{marginLeft: '8px'}} href={`https://docs.google.com/document/d/${this.props.state.docId}/edit`}>Edit Google Doc Template</a>
                  :
                  <React.Fragment/>
                }
            </Container>
          </Container>
        </section>
      )
  }
}

TemplateCreation.propTypes = {
};

export default connect((state) => (
  {
    state: state
  }
),
  { setFileId,
    performFileSearch,
    fetchMergeFields,
    changeMergeStyle,
    getMiraklTokenStatus,
    searchMiraklOrders,
    submitMergeFields,
    submitUserTemplate,
    loadUserTemplateForFile,
    setModalInfo,
    showModal,
    onTagClick,
    onTableClick,
    createBlankGoogleDoc,
    updateDocTemplateName
  }
)
(withStyles(styles)(TemplateCreation));
