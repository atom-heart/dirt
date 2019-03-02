import React, { Fragment } from 'react'

import { Card } from 'reactstrap'

import TableHeader from './TableHeader'
import SplitRanking from './SplitRanking'
import SplitProgress from './SplitProgress'
import ProgressButton from './ProgressButton'
import FinishSplitButton from './FinishSplitButton'

class Split extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showProgress: false,
      showModal: false,
      user: null,
      finishSplitLoading: false
    }

    this.toggleProgress = this.toggleProgress.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleProgress() {
    this.setState({ showProgress: !this.state.showProgress })
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  render() {
    let ranking = this.state.showProgress ? (
      <SplitProgress ranking={this.props.split.progress} />
    ) : (
      <SplitRanking split={this.props.split} />
    )

    const finishButtonStyle = !this.props.split.last_in_stage ? {marginTop: '-20px'} : {}

    return (
      <Fragment>
        <Card>
          <TableHeader
            title={`${this.props.split.order}. ${this.props.split.track}`}
            subtitle={this.props.split.weather}
          />

          {(this.props.split.active || this.props.split.finished) && ranking}

          {(this.props.split.active || this.props.split.finished) &&
            <ProgressButton onClick={this.toggleProgress} disabled={this.props.split.order === 1}>
              {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
            </ProgressButton>
          }
        </Card>

        {(this.props.split.finished && this.props.split.active) &&
          <Fragment>
            {this.props.split.last_in_stage && <hr />}
            <Card style={finishButtonStyle}>
              <FinishSplitButton splitId={this.props.split.id} />
            </Card>
          </Fragment>
        }

        {!this.props.split.last_in_stage && <hr />}
      </Fragment>
    )
  }
}

export default Split
