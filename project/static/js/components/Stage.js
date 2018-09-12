import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchStage } from '../actions/event-actions.js';

class Stage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchStage(this.props.match.params.stageId);
  }

  componentDidUpdate() {
    if (!this.currentStage.loaded) {
      this.props.fetchStage(this.props.match.params.stageId);
    }
  }

  render() {
    this.currentStage = this.props.stages.find(stage => {
      return stage.id == this.props.match.params.stageId
    });

    if (this.currentStage.isLoading) {
      return <div>Loading...</div>;
    }

    else if (!this.currentStage) {
      return <div>No such stage.</div>;
    }

    else {
      return <div><strong>Stage:</strong> {this.props.match.params.stageId}</div>;
    }
  }
}

const mapStateToProps = state => ({
  stages: state.event.stages
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchStage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
