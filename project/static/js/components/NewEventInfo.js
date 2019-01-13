import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Card, Input, Button } from 'reactstrap'

import TableHeader from './TableHeader'

import { updateEventName } from '../actions/new-event-actions'

class NewEventInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editName: false }

    this.updateName = this.updateName.bind(this)
    this.toggleNameUpdate = this.toggleNameUpdate.bind(this)
  }

  updateName(event) {
    this.props.updateEventName(event.target.value)
  }

  toggleNameUpdate() {
    this.setState({ editName: !this.state.editName })
  }

  render() {
    const header = this.state.editName ? (
      <TableHeader>
        <Input
          autoFocus={true}
          value={this.props.name}
          onChange={this.updateName}
        />
        <Button
          style={{marginLeft: 10}}
          color="primary"
          onClick={this.toggleNameUpdate}
        >
          Save
        </Button>
      </TableHeader>
    ) : (
      <TableHeader>
        <h4>{this.props.name || 'New event'}</h4>
        <span
          className="text-muted weather"
          style={{cursor: 'pointer'}}
          onClick={this.toggleNameUpdate}
        >
          Edit name
        </span>
      </TableHeader>
    )

    return (
      <Card>
        {header}

        <table className="table">
          <tbody>
            <tr>
              <td>Game:</td>
              <td>DiRT Rally</td>
            </tr>
          </tbody>
        </table>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  name: state.newEvent.name
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateEventName
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEventInfo)
