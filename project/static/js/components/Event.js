import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { fetchEventData, isLoading, reloadEvent } from '../actions/event-actions.js';

import Sidebar from './Sidebar';
import NavSection from './NavSection';
import PageLoader from './PageLoader';
import EventInfo from './EventInfo';
import Stage from './Stage';

import { Row, Button } from 'reactstrap';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.eventId = this.props.match.params.id;
    this.reloadEvent = this.reloadEvent.bind(this);
  }

  reloadEvent(event) {
    event.preventDefault();
    this.props.reloadEvent();
  }

  componentDidMount() {
    this.props.fetchEventData(this.eventId);
  }

  componentDidUpdate() {
    if (!this.props.loaded && !this.props.error) {
      this.props.fetchEventData(this.eventId);
    }
  }

  render() {

    if (this.props.isLoading) {
      return <PageLoader />;
    }

    else if(this.props.error) {
      return <div>Error fetching event data. <a href="#" onClick={this.reloadEvent}>Click here</a> to try again.</div>;
    }

    else {
      return (
        <Row>
          <Sidebar
            eventId={this.eventId}
            eventName={this.props.name}
            className="col-4"
          />
          <div className="col" id="main">
            <Route path={`/event/${this.eventId}`} exact component={EventInfo} />
            <Route
              exact
              path={`/event/${this.eventId}/:stageId`}
              component={Stage}
            />
          </div>
        </Row>
      );
    }

  }
}

const mapStateToProps = state => state.event;

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchEventData,
    loading: isLoading,
    reloadEvent
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
