import React from 'react';

import { Row, Col, Input, Button, Modal, ModalHeader } from 'reactstrap';

class AddTimeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <Modal
        className="split-modal"
        isOpen={this.state.modal}
        toggle={this.toggle}
        centered
      >

        <div className="modal-header d-flex">
          <div>
            <h5 className="modal-title">Add time</h5>
            <div className="text-muted">
              <span className="player-name">Player</span> / <span>Track</span>
            </div>
          </div>
          <button type="button" className="close" onClick={this.toggle}>
            <span>&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <Row className="no-gutters">
            <Col className="time-input">
              <Input className="form-controll" placeholder="00" maxLength="2" />
            </Col>
            <Col className="time-input">
              <Input className="form-controll" placeholder="00" maxLength="2" />
            </Col>
            <Col className="time-input-3">
              <Input className="form-controll" placeholder="000" maxLength="3" />
            </Col>
            <Col>
              <Button color="primary" style={{width: '100%'}}>Add</Button>
            </Col>
          </Row>
        </div>

        <div className="modal-footer">
          <Button color="danger">Disqualify</Button>
        </div>

      </Modal>
    );
  }
}

export default AddTimeModal;
