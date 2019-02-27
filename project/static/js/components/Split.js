import React from 'react'

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

  toggleProgress(event) {
    this.setState({ showProgress: !this.state.showProgress })
  }

  toggleModal(e) {
    this.setState({ showModal: !this.state.showModal })
  }

  render() {
    let ranking = this.state.showProgress ? (
      <SplitProgress ranking={this.props.split.progress} />
    ) : (
      <SplitRanking split={this.props.split} />
    )

    return (
      <Card>
        <TableHeader
          title={`${this.props.split.order}. ${this.props.split.track}`}
          subtitle={this.props.split.weather}
        />

        {(this.props.split.active || this.props.split.finished) && ranking}

        {(this.props.split.finished && this.props.split.active) &&
          <FinishSplitButton splitId={this.props.split.id} />
        }

        {(this.props.split.finished && !this.props.split.active) &&
          <ProgressButton onClick={this.toggleProgress}>
            {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
          </ProgressButton>
        }
      </Card>
    )
  }
}

export default Split
