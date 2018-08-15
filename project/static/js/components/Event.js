import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchEventData, isLoading } from '../actions/event-actions.js';

import Sidebar from './Sidebar';
import NavSection from './NavSection';
import PageLoader from './PageLoader';

import { Container, Row, Button } from 'reactstrap';

class Event extends React.Component {
  componentDidMount() {
    this.props.fetchEventData();
  }

  render() {
    if (this.props.isLoading) {
      return <PageLoader />
    } else {
      return (
        <Container>
          <Row>
            <Sidebar />
          </Row>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => state.event

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchEventData,
    loading: isLoading
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
