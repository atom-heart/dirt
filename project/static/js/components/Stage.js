import React from 'react';
import { connect } from 'react-redux';

class Stage extends React.Component {
  render() {
    return <div><strong>Stage:</strong> {this.props.match.params.stage}</div>;
  }
}

export default Stage;
