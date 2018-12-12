import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Input } from 'reactstrap'

import { updateTime } from '../actions/turn-actions'

class TimeInput extends React.Component {
  constructor(props) {
    super(props)

    this.getTimeHandler = this.getTimeHandler.bind(this)
    this.formatTime = this.formatTime.bind(this)
  }

  getTimeHandler(interval, max) {
    function handleTime(event) {
      const value = parseInt(event.target.value, 10)

      if (value <= max) {
        this.props.updateTime(interval, value)
      }
    }
    return handleTime.bind(this)
  }

  formatTime(value, maxLength) {
    return value.toString().padStart(maxLength, '0')
  }

  render() {
    return (
      <Row className="no-gutters">
        <Col>
          <Input
            autoFocus={true}
            value={this.formatTime(this.props.time.minutes, 2)}
            onChange={this.getTimeHandler('minutes', 99)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col style={{marginLeft: 10}}>
          <Input
            value={this.formatTime(this.props.time.seconds, 2)}
            onChange={this.getTimeHandler('seconds', 99)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col style={{marginLeft: 10}}>
          <Input
            value={this.formatTime(this.props.time.milliseconds, 3)}
            onChange={this.getTimeHandler('milliseconds', 999)}
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
