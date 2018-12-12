import React from 'react'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

import NavSection from './NavSection'

class Sidebar extends React.Component {
  render() {
    let stages = this.props.stageIds.map((id) => {
      const stage = this.props.stages[id]

      return (
        <li className="nav-item" key={stage.id}>
          <NavLink
            to={`/event/${this.props.eventId}/${stage.id}`}
            className="nav-link"
          >
            {stage.country}
          </NavLink>
        </li>
      )
    })

    return (
      <nav id="sidebar" className="col-4">
        <h2 className="navbar-brand">{this.props.eventName}</h2>
        <NavSection>
          <li className="nav-item">
            <NavLink
              exact
              to={`/event/${this.props.eventId}`}
              className="nav-link"
            >
              Event
            </NavLink>
          </li>
        </NavSection>
        <NavSection>
          {stages}
        </NavSection>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  stages: state.stages.byId,
  stageIds: state.stages.allIds
})

export default connect(mapStateToProps, null, null, {pure: false})(Sidebar)
