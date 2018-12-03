import React from 'react'

const ModalCloseButton = (props) => {
  return (
    <button type="button" className="close" onClick={props.onClick}>
      <span>&times;</span>
    </button>
  )
}

export default ModalCloseButton
