import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchStage, reloadStage } from '../actions/event-actions.js';

import { Card } from 'reactstrap';

import TableHeader from './TableHeader';
import StageRanking from './StageRanking';
import StageProgress from './StageProgress';
import Split from './Split';
import AddTimeModal from './AddTimeModal';
import ProgressButton from './ProgressButton';
import StageFinishedFooter from './StageFinishedFooter';

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showProgress: false }

    this.reloadStage = this.reloadStage.bind(this);
    this.toggleProgress = this.toggleProgress.bind(this);
  }

  reloadStage(event) {
    event.preventDefault();
    this.props.reloadStage(this.props.match.params.stageId);
  }

  toggleProgress(event) {
    this.setState({ showProgress: !this.state.showProgress });
  }

  componentDidMount() {
    if (this.currentStage && !this.currentStage.loaded) {
      this.props.fetchStage(this.props.match.params.stageId);
    }
  }

  componentDidUpdate() {
    if (this.currentStage && !this.currentStage.loaded && !this.currentStage.error) {
      this.props.fetchStage(this.props.match.params.stageId);
    }
  }

  render() {
    this.currentStage = this.props.stages.find(stage => {
      return stage.id == this.props.match.params.stageId
    });

    if (!this.currentStage) {
      return <div>No such stage.</div>;
    }

    else if (this.currentStage.error) {
      return <div>Error loading stage data. <a href="#" onClick={this.reloadStage}>Click here</a> to try again.</div>;
    }

    else if (this.currentStage.isLoading) {
      return <div>Loading...</div>;
    }

    else {
      let currentStageSplits = this.props.splits.filter(split => (
        split.stage_id == this.props.match.params.stageId
      ));

      let stageRanking = this.currentStage.finished && this.state.showProgress ? (
        <StageProgress ranking={this.currentStage.progress} />
      ) : (
        <StageRanking ranking={this.currentStage.ranking} />
      );

      let splits = currentStageSplits.map(split => (
        <Split split={split} key={split.id} />
      ));

      return (
        <div>
          <Card>

            <TableHeader>
              <h4>{this.currentStage.country}</h4>
              {!this.currentStage.finished &&
                <span className="text-muted weather">
                  In progress
                </span>
              }
            </TableHeader>

            {this.currentStage.finished &&
              <div>
                {stageRanking}
                <ProgressButton onClick={this.toggleProgress}>
                  {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
                </ProgressButton>
              </div>
            }

          </Card>

          <hr />

          {splits}

          {this.currentStage.finished &&
            <div>
              <hr />
              <StageFinishedFooter />
            </div>
          }

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
