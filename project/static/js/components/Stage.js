import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchStage } from '../agents/stages-agents'

import { Card } from 'reactstrap'

import Split from './Split'
import TableHeader from './TableHeader'
import StageRanking from './StageRanking'
import StageProgress from './StageProgress'
import ProgressButton from './ProgressButton'
import StageFinishedFooter from './StageFinishedFooter'

class Stage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showProgress: false }

    this.loadStage = this.loadStage.bind(this)
    this.toggleProgress = this.toggleProgress.bind(this)
  }

  loadStage() {
    this.props.fetchStage(this.stage.id)
  }

  toggleProgress() {
    this.setState({ showProgress: !this.state.showProgress })
  }

  componentDidMount() {
    if (
      this.stage &&
      !this.stage.isLoading &&
      !this.stage.hasLoaded
    ) {
      this.loadStage()
    }
  }

  componentDidUpdate() {
    if (
      this.stage &&
      !this.stage.isLoading &&
      !this.stage.hasLoaded &&
      !this.stage.error
    ) {
      this.loadStage()
    }
  }

  render() {
    this.stage = this.props.stages[this.props.match.params.stageId]

    if (!this.stage) {
      return <div>No such stage.</div>
    }

    else if (this.stage.error) {
      return <div>Error loading stage data. <a href="#" onClick={this.loadStage}>Click here</a> to try again.</div>
    }

    else if (this.stage.isLoading || !this.stage.hasLoaded) {
      return <div>Loading...</div>
    }

    else {
      const splits = this.props.splitIds.filter(id => {
        const split = this.props.splits[id]
        return split.stage_id == this.props.match.params.stageId
      }).map(id => {
        const split = this.props.splits[id]
        return <Split split={split} key={split.id} />
      })

      return (
        <div>
          <Card>

            <TableHeader>
              <h4>
                {this.stage.country}
              </h4>
              <span className="text-muted weather">
                {this.stage.finished ? 'Finished' : 'In progress'}
              </span>
            </TableHeader>

            {this.stage.finished &&
              <div>
                {this.state.showProgress ? (
                  <StageProgress ranking={this.stage.progress} />
                ) : (
                  <StageRanking ranking={this.stage.ranking} />
                )}
                <ProgressButton onClick={this.toggleProgress}>
                  {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
                </ProgressButton>
              </div>
            }

          </Card>

          <hr />

          {splits}

          {this.stage.finished &&
            <div>
              <hr />
              <StageFinishedFooter />
            </div>
          }
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  stages: state.stages.byId,
  splits: state.splits.byId,
  splitIds: state.splits.allIds,
  players: state.event.players
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchStage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage)
