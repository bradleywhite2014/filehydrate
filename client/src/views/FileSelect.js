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

class FileSelect extends Component {

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
              {
                this.props.state.docId ?
                  <a style={{marginLeft: '8px'}} href={`https://docs.google.com/document/d/${this.props.state.docId}/edit`}>Edit Google Doc Template</a>
                :
                <React.Fragment/>
              }
            <AutoComplete
              id="tags-standard"
              options={this.props.state.fileList}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => option.value}
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
          </Container>
          <Container className={styles.container}>
            <Grid style={{marginTop: "36px", marginBottom: "8px"}} item>
              <Typography style={{marginTop: "8px"}} variant="h5" marked="center" component="h2">
                Data Source:
              </Typography>
              <ToggleButtonGroup size="large" value={this.props.state.mergeStyle} exclusive onChange={this.changeMergeStyle}>
                <ToggleButton key={1} value="manual">
                  <Typography style={{marginTop: "8px"}} variant="h5" marked="center" component="h2">
                    Manual
                  </Typography>
                </ToggleButton>,
                <ToggleButton key={2} value="mirakl">
                  <Typography style={{marginTop: "8px"}} variant="h5" marked="center" component="h2">
                    Mirakl
                  </Typography>
                </ToggleButton>,
                <ToggleButton key={3} value="gsheet" disabled={true}>
                  <Typography style={{marginTop: "8px"}} variant="h5" marked="center" component="h2">
                    Google Sheets
                  </Typography>
                </ToggleButton>,
              </ToggleButtonGroup>
            </Grid>
          </Container>
         { this.props.state.docId && this.props.state.mergeStyle === 'manual' ?
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
        : this.props.state.docId && this.props.state.mergeStyle === 'mirakl' ?
          <div>
            {this.props.state.loadingOrders ? 
              <React.Fragment>
              <Skeleton animation="wave" height={60} />
              <Skeleton animation="wave" height={600} />
            </React.Fragment> : 
            this.props.state.tableList && this.props.state.tableList.length > 0 && !this.props.state.modalTableListKey ? 
            <SearchDataTable
              modalTableListKey={this.props.state.modalTableListKey}
              modalTableListKeyList={this.props.state.modalTableListKeyList}
              isLoadingTemplate={this.props.state.loadingTemplate}
              triggerLoadTemplate={() => this.props.loadUserTemplateForFile(this.props.state.docId)}
              triggerSaveTemplate={() => this.props.submitUserTemplate({userDetails: {docId: this.props.state.docId, formFields: this.props.state.mappingFields}})}
              triggerRefresh={this.props.searchMiraklOrders}
              loadingOrders={this.props.state.loadingOrders}
              miraklHeaders={this.props.state.miraklHeaders} 
              onTagClick={this.props.onTagClick}
              onTableClick={this.props.onTableClick}
              formFields={this.props.state.formFields}
              mappingFields={this.props.state.mappingFields}
              docId={this.props.state.docId}
              submitMergeFields={this.props.submitMergeFields}
              tableList={this.props.state.tableList}
              formToMappingFields={this.props.state.formToMappingFields}
            />
            :
            <React.Fragment />
            } 
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
(withStyles(styles)(FileSelect));
