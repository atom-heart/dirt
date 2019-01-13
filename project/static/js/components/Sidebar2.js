import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import NavSection from './NavSection'
import CreateEventButton from './CreateEventButton'

class Sidebar2 extends React.Component {
  render() {
    const stages = this.props.stages.map((stageId, index) => {
      const country = this.props.countries.find(c => c.id === stageId)
      const order = index + 1

      return (
        <li key={index}>
          <NavLink
            exact
            to={`/new/stage/${order}`}
            className="nav-link"
          >
            {country.name}
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
              to={'/new'}
              className="nav-link"
            >
              Event
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to={'/new/classes'}
              className="nav-link"
            >
              Car classes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to={'/new/players'}
              className="nav-link"
            >
              Players
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to={'/new/stages'}
              className="nav-link"
            >
              Stages
            </NavLink>
          </li>
        </NavSection>
        {this.props.stages.length > 0 &&
          <NavSection>
            {stages}
          </NavSection>
        }
        <CreateEventButton />
      </nav>
    )
  }
}

export default Sidebar2
