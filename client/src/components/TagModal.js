import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {hideModal,onTagClick} from '../lib/actions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


class GlobalModal extends Component {
  constructor(props) {
    super(props)
    this.onHide = this.onHide.bind(this);
  }

  onHide = (event) => {
    this.props.hideModal()
  }

  buildLink = (id) => {
    return 'https://docs.google.com/document/d/' + id
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
              { <FormControlLabel
                        control={<GreenCheckbox name="checkedG" />}
                        label={'test'}
                    />
                    }
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
  { hideModal, onTagClick }
)
((GlobalModal));