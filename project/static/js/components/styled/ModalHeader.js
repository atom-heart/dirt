import React from 'react'

const ModalHeader = (props) => {
  return (
    <div className="modal-header d-flex">
      {props.children}
    </div>
  )
}

export default ModalHeader
