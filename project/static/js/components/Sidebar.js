import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import NavSection from './NavSection';

class Sidebar extends React.Component {
  render() {
    let stages = this.props.stages.map((stage) => (
      <li className="nav-item" key={stage.id}>
        <NavLink
          to={`/event/${this.props.eventId}/${stage.country.toLowerCase()}`}
          className="nav-link"
        >
          {stage.country}
        </NavLink>
      </li>
    ));

    return (
      <nav id="sidebar">
        <h2 className="navbar-brand">{this.props.eventName}</h2>
        <NavSection>
          <li className="nav-item">
            <NavLink
              exact
              to={`/event/${this.props.eventId}`}
              className="nav-link"
            >
              Informations
            </NavLink>
          </li>
        </NavSection>
        <NavSection>
          {stages}
        </NavSection>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  stages: state.event.stages
});

export default connect(mapStateToProps, null, null, {pure: false})(Sidebar);
