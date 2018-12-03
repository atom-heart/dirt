import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Input } from 'reactstrap'

import { updateTime } from '../actions/turn-actions'

class TimeInput extends React.Component {
  constructor(props) {
    super(props)
  }

  getChangeHandler(interval) {
    function handleChange(event) {
      const newTime = Object.assign(this.props.time, { [interval]: event.target.value })
      this.props.updateTime(newTime)
    }

    return handleChange
  }

  render() {
    return (
      <Row className="no-gutters">
        <Col>
          <Input
            placeholder="00"
            maxLength="2"
            onChange={this.getChangeHandler('minutes').bind(this)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col style={{marginLeft: 10}}>
          <Input
            placeholder="00"
            maxLength="2"
            onChange={this.getChangeHandler('seconds').bind(this)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col style={{marginLeft: 10}}>
          <Input
            placeholder="000"
            maxLength="3"
            onChange={this.getChangeHandler('milliseconds').bind(this)}
            disabled={this.props.disabled}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  time: state.turn.time
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateTime
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeInput)
