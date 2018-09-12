import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { fetchEventData, isLoading } from '../actions/event-actions.js';

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
  }

  componentDidMount() {
    this.props.fetchEventData(this.eventId);
  }

  render() {
    if (this.props.isLoading) {
      return <PageLoader />;
    } else {
      return (
        <div>
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
        </div>
      );
    }
  }
}

const mapStateToProps = state => state.event;

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchEventData,
    loading: isLoading
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
