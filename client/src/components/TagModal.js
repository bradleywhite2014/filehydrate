import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {onTagClick, onCheckClick} from '../lib/actions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$disabled': {
      color: 'grey',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


class TagModal extends Component {
  constructor(props) {
    super(props)
    this.isChecked = this.isChecked.bind(this);
  }

  isChecked = (modalTableListKey, formToMappingFields, mappingFields, header, formKey) => {
    if(modalTableListKey){
      return !!formToMappingFields[formKey] || mappingFields[modalTableListKey][header].column_mapping === formKey;
    }else{
      return !!formToMappingFields[formKey] || mappingFields[header].column_mapping === formKey;
    }
  }

  render() {
    return  (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={true}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.header}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Fields</h4>
              <div style={{display: 'flex', flexDirection: 'column', maxHeight: '250px', overflowY: 'scroll'}}>
                {Object.keys(this.props.state.formFields).map( key => {
                  return <div style={{display: 'flex'}}> <FormControlLabel
                      control={<GreenCheckbox onClick={(event) => this.props.onCheckClick({key, columnHeader: this.props.header, selected: event.target.checked})} checked={this.isChecked(this.props.state.modalTableListKey, this.props.state.formToMappingFields, this.props.state.mappingFields, this.props.header, key)} name="checkedG" />}
                      label={key}
                      disabled={(!!this.props.state.formToMappingFields[key] && this.props.state.formToMappingFields[key] !== this.props.header)}
                  />
                  {
                    !!this.props.state.formToMappingFields[key] ? <label style={{color: 'green'}}>Currently assigned to {this.props.state.formToMappingFields[key]}</label> : <React.Fragment/>
                  }
                  </div> 
                })
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(event) => this.props.onTagClick(this.props.header)}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
    

export default connect((state) => (
  {
    state: state
  }
),
  { onTagClick, onCheckClick }
)
((TagModal));