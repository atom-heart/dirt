import React from 'react';
import { connect } from 'react-redux';

import NavSection from './NavSection';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav id="sidebar" className="col-4">
        <h2 className="navbar-brand">Championship</h2>
        <NavSection items={this.props.stages} />
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  stages: state.event.stages
});

export default connect(mapStateToProps)(Sidebar);
