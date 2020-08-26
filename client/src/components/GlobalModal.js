import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {hideModal} from '../lib/actions';


class GlobalModal extends Component {
  constructor(props) {
    super(props)
    this.onHide = this.onHide.bind(this);
  }

  onHide = (event) => {
    this.props.hideModal()
  }

  //TODO: fix hacky ternary for document links
  buildLink = (id) => {
    return 'https://docs.google.com/document/d/' + id
  }

  render() {
    return this.props.state.showGlobalModal ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={true}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.state.globalModal.header}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.state.modalTableList ? <React.Fragment></React.Fragment> : <div/> }
            <h4>{this.props.state.globalModal.title}</h4>
              {this.props.state.globalModal.title === 'Document Links' ? this.props.state.globalModal.content.map((id) => <li> <a href={this.buildLink(id)}>{this.buildLink(id)}</a> </li>) : this.props.state.globalModal.content}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      ) : <React.Fragment />;
    }
  }
    

export default connect((state) => (
  {
    state: state
  }
),
  { hideModal }
)
((GlobalModal));