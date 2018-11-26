import React from 'react'

const CardButton = props => (
  <div className="card-footer border-top">
    <button
      className="btn btn-link progress-toggle"
    >
      {props.text}
    </button>
  </div>
)

export default CardButton
