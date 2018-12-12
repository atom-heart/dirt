import React from 'react'

const ModalError = (props) => {
  return (
    <div className="modal-error bg-danger">
      {props.children}
    </div>
  )
}

export default ModalError
