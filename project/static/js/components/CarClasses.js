import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { addClassEvent, removeClassEvent } from '../actions/new-event-actions'

import { Card, CustomInput } from 'reactstrap'

import TableHeader from './TableHeader'

class CarClasses extends React.Component {
  constructor(props) {
    super(props)

    this.toggleClass = this.toggleClass.bind(this)
  }

  toggleClass(id) {
    if (this.props.eventPlayers.length > 0) {
      return
    }
    
    if (this.props.eventClasses.includes(id)) {
      this.props.removeClass(id)
    } else {
      this.props.addClass(id)
    }
  }

  render() {
    const disabled = this.props.eventPlayers.length > 0

    const classes = this.props.gameClasses.map(cc => {
      const checked = this.props.eventClasses.includes(cc.id)

      return (
        <tr key={cc.id} className="interactive-row" onClick={() => this.toggleClass(cc.id)}>
          <td>
            <CustomInput
              id={cc.id}
              type="checkbox"
              checked={checked}
              onChange={() => this.toggleClass(cc.id)}
              label={cc.name}
              disabled={disabled}
            />
          </td>
        </tr>
      )
    })

    return (
      <div>
        <Card>
          <TableHeader><h4>Car classes</h4></TableHeader>

          <table className="table interactive-table">
            <tbody>
              {classes}
            </tbody>
          </table>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  gameClasses: state.newEvent.game.carClasses,
  eventClasses: state.newEvent.event.classes,
  eventPlayers: state.newEvent.event.players
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    addClass: addClassEvent,
    removeClass: removeClassEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CarClasses)
