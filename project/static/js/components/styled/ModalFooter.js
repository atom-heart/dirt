import React from 'react'

const ModalFooter = (props) => {
  return (
    <div className="modal-footer d-flex justify-content-between">
      {props.children}
    </div>
  )
}

export default ModalFooter
