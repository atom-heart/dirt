import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isLoadingModal, dispatchUpdateTurn, sendTurn } from '../actions/forms-actions.js';

import { Row, Col, Input, Button, Modal, ModalHeader, FormGroup, Label } from 'reactstrap';

const marginLeft = { marginLeft: 10 }
const dimBackground = { background: '#f6f6f6' }

class AddTimeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: false,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      disqualify: false
    }

    if (props.update && props.player.time) {
      const time = props.player.time;

      this.state.minutes = parseInt(time.slice(0, 2), 10);
      this.state.seconds = parseInt(time.slice(3, 5), 10);
      this.state.milliseconds = parseInt(time.slice(6), 10);
    } else if (props.update) {
      this.state.disqualify = true;
    }

    this.toggleConfirm = this.toggleConfirm.bind(this);
    this.handleMins = this.handleMins.bind(this);
    this.handleSecs = this.handleSecs.bind(this);
    this.handleMills = this.handleMills.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleConfirm() {
    this.setState({ confirmation: !this.state.confirmation });
  }

  handleMins(event) { this.props.updateTurn({ mins: event.target.value }) }
  handleSecs(event) { this.props.updateTurn({ secs: event.target.value }) }
  handleMills(event) { this.props.updateTurn({ mills: event.target.value }) }
  handleCheckbox() { this.props.updateTurn({ disq: !this.props.disq }) }

  handleSubmit(event) {
    event.preventDefault();

    let time = new Date(0, 0, 0, 0, this.props.mins, this.props.secs, this.props.mills);

    let data = {
      player_id: this.props.player.id,
      split_id: this.props.split.id,
      action: this.props.disq ? 'DISQUALIFY' : 'ADD_TIME',
      time: this.props.disq ? null : time.toJSON()
    }

    this.props.sendTurn(data);
  }

  render() {
    let title, footer = null;

    if (this.props.update) {
      title = 'Update';
    } else {
      title = 'Add time';
    }

    let blockInput = this.state.error || this.state.disqualify;

    return (
      <div id="splitModal" className="modal" style={{
          display: 'block',
          background: 'rgba(0, 0, 0, .5)'
      }}>
        <div className="split-modal modal-dialog modal-dialog-centered">

          <div className="modal-content">

            <div className="modal-header d-flex">
              <div>
                <h5 className="modal-title">{title}</h5>
                <span className="text-muted">
                  {this.props.player.name} / {this.props.split.track}
                </span>
              </div>
              <button type="button" className="close" onClick={this.props.close}>
                <span>&times;</span>
              </button>
            </div>

            <form onSubmit={this.handleSubmit} style={{marginBottom: 0}}>

              <div className="modal-body">
                <Row className="no-gutters">
                  <Col>
                    <Input placeholder={this.state.minutes} maxLength="2" disabled={blockInput} onChange={this.handleMins} />
                  </Col>
                  <Col style={marginLeft}>
                    <Input placeholder={this.state.seconds} maxLength="2" disabled={blockInput} onChange={this.handleSecs} />
                  </Col>
                  <Col style={marginLeft}>
                    <Input placeholder={this.state.milliseconds} maxLength="3" disabled={blockInput} onChange={this.handleMills} />
                  </Col>
                </Row>
              </div>


              {!this.props.isLoading ? (
                <div className="modal-footer d-flex justify-content-between">
                  <FormGroup check>
                    <Label check>
                      <Input checked={this.props.disq} type="checkbox" onChange={this.handleCheckbox} />
                      Disqualify
                    </Label>
                  </FormGroup>
                  <div>
                    <Button type="submit" color="primary" onClick={this.toggleConfirm} style={{marginLeft: 5, minWidth: 80}}>
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="modal-footer d-flex justify-content-end">
                  Loading...
                </div>
              )}

            </form>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state.forms.addTimeForm;

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateTurn: dispatchUpdateTurn,
    isLoadingModal,
    sendTurn
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTimeModal);
