import React from 'react'
import { connect } from 'react-redux'

import { Card } from 'reactstrap'

import EventRanking from './EventRanking'
import TableHeader from './TableHeader'

class Standings extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Card>
        <TableHeader title={'Standings'} />
        <EventRanking ranking={this.props.ranking} />
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  ranking: state.event.ranking
})

export default connect(mapStateToProps)(Standings)
