import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchStage, reloadStage } from '../actions/event-actions.js';

import StageRanking from './StageRanking';
import SplitRanking from './SplitRanking';
import AddTimeModal from './AddTimeModal';

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.reloadStage = this.reloadStage.bind(this);
  }

  reloadStage(event) {
    event.preventDefault();
    this.props.reloadStage(this.props.match.params.stageId);
  }

  componentDidMount() {
    if (!this.currentStage.loaded) {
      this.props.fetchStage(this.props.match.params.stageId);
    }
  }

  componentDidUpdate() {
    if (!(this.currentStage.loaded || this.currentStage.error)) {
      this.props.fetchStage(this.props.match.params.stageId);
    }
  }

  render() {
    this.currentStage = this.props.stages.find(stage => {
      return stage.id == this.props.match.params.stageId
    });

    let currentStageSplits = this.props.splits.filter(split => (
      split.stage_id == this.props.match.params.stageId
    ));

    let splitRankings = currentStageSplits.map(split => (
      <SplitRanking split={split} key={split.id} />
    ));

    if (this.currentStage.isLoading) {
      return <div>Loading...</div>;
    }

    else if (this.currentStage.error) {
      return <div>Error loading stage data. <a href="#" onClick={this.reloadStage}>Click here</a> to try again.</div>;
    }

    else if (!this.currentStage) {
      return <div>No such stage.</div>;
    }

    else {
      return (
        <div>
          {this.currentStage.finished ? <StageRanking stage={this.currentStage} country={this.currentStage.country} finished /> : <StageRanking stage={this.props.players} country={this.currentStage.country} />}
          <hr />
          {splitRankings}
          <AddTimeModal />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  stages: state.event.stages,
  splits: state.event.splits,
  players: state.event.players
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchStage,
    reloadStage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
