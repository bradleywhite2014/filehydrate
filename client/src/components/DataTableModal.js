import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {hideDataModal, loadUserTemplateForFile, submitUserTemplate, searchMiraklOrders, onTagClick, onTableClick} from '../lib/actions';
import SearchDataTable from '../components/SearchDataTable';

class DataTableModal extends Component {
  constructor(props) {
    super(props)
    this.onHide = this.onHide.bind(this);
  }

  onHide = (event) => {
    this.props.hideDataModal()
  }

  //TODO: fix hacky ternary for document links
  buildLink = (id) => {
    return 'https://docs.google.com/document/d/' + id
  }

  render() {
    return this.props.state.modalTableListKey ? (
        <Modal
          size="xl"
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
              <SearchDataTable modalTableListKey={this.props.state.modalTableListKey} isLoadingTemplate={this.props.state.loadingTemplate} triggerLoadTemplate={() => this.props.loadUserTemplateForFile(this.props.state.docId)} triggerSaveTemplate={() => this.props.submitUserTemplate({userDetails: {docId: this.props.state.docId, formFields: this.props.state.mappingFields}})} triggerRefresh={this.props.searchMiraklOrders} loadingOrders={this.props.state.loadingOrders} miraklHeaders={this.props.state.modalTableHeaders} onTagClick={this.props.onTagClick} onTableClick={this.props.onTableClick} formFields={this.props.state.formFields} mappingFields={this.props.state.mappingFields} docId={this.props.state.docId} submitMergeFields={this.props.submitMergeFields} tableList={this.props.state.modalTableList} />
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
  { hideDataModal , loadUserTemplateForFile, submitUserTemplate, searchMiraklOrders, onTagClick, onTableClick}
)
((DataTableModal));