import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "../components/CustomButtons/Button.js";
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

  isChecked = (subFields, header, formKey) => {
    return subFields[header].column_mapping === formKey
  }

  render() {
    return  (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={true}
          animation={false}
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
                  return <div style={{display: 'flex' , marginLeft: '8px'}}> <FormControlLabel
                      control={<GreenCheckbox onClick={(event) => this.props.onCheckClick({key, columnHeader: this.props.header, selected: event.target.checked})} checked={this.isChecked(this.props.subFields, this.props.header, key)} name="checked" />}
                      label={key}
                      disabled={(!!this.props.state.formToMappingFields[key] && !!this.props.state.formToMappingFields[key].value && this.props.state.formToMappingFields[key].value !== this.props.header)}
                  />
                  {
                    !!this.props.state.formToMappingFields[key] && !!this.props.state.formToMappingFields[key].value ? <label style={{color: 'green'}}>Currently assigned to {this.props.state.formToMappingFields[key].value}</label> : <React.Fragment/>
                  }
                  </div> 
                })
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
          <Button 
                color="danger"
                size="lg"
                rel="noopener noreferrer"
                onClick={(event) => this.props.onTagClick(this.props.header)}>Close</Button>
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