import React from 'react'

const ProgressButton = props => (
  <div className="card-footer" style={props.style}>
    <button
      onClick={props.onClick}
      className="btn btn-link progress-toggle"
    >
      {props.children}
    </button>
  </div>
)

export default ProgressButton
