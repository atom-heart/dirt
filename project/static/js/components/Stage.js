import React, { Fragment } from 'react'
// import { Fragment } from 'react-dom'
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

import getStage from '../selectors/getStage'

class Stage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showProgress: false }

    this.loadStage = this.loadStage.bind(this)
    this.toggleProgress = this.toggleProgress.bind(this)
  }

  loadStage() {
    this.props.fetchStage(this.props.stage.id)
  }

  toggleProgress() {
    this.setState({ showProgress: !this.state.showProgress })
  }

  componentDidMount() {
    if (
      this.props.stage &&
      !this.props.stage.isLoading &&
      !this.props.stage.hasLoaded
    ) {
      this.loadStage()
    }
  }

  componentDidUpdate() {
    if (
      this.props.stage &&
      !this.props.stage.isLoading &&
      !this.props.stage.hasLoaded &&
      !this.props.stage.error
    ) {
      this.loadStage()
    }
  }

  render() {
    if (!this.props.stage) {
      return <div>No such stage.</div>
    }

    else if (this.props.stage.error) {
      return <div>Error loading stage data. <a href="#" onClick={this.loadStage}>Click here</a> to try again.</div>
    }

    else if (this.props.stage.isLoading || !this.props.stage.hasLoaded) {
      return <div>Loading...</div>
    }

    else {
      const splits = this.props.splitIds.filter(id => {
        const split = this.props.splits[id]
        return split.stage_id == this.props.stage.id
      }).map(id => {
        const split = this.props.splits[id]
        return <Split split={split} key={split.id} />
      })

      return (
        <div>
          <Card>
            <TableHeader
              title={this.props.stage.country}
              subtitle={this.props.stage.finished ? 'Finished' : 'In progress'}
            />
          </Card>

          <hr />

          {this.props.stage.finished &&
          <Fragment>
            <Card>
              <TableHeader title={'Stage ranking'} />

              {this.state.showProgress ? (
                <StageProgress ranking={this.props.stage.progress} />
              ) : (
                <StageRanking ranking={this.props.stage.ranking} />
              )}
              <ProgressButton onClick={this.toggleProgress}>
                {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
              </ProgressButton>
            </Card>

            <hr />
          </Fragment>
          }

          {splits}

          {this.props.stage.finished &&
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

const mapStateToProps = (state, props) => {
  const stage = getStage(state, props.match.params.stageOrder)

  return {
    splits: state.splits.byId,
    splitIds: state.splits.allIds,
    players: state.event.players,
    stage
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchStage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage)
