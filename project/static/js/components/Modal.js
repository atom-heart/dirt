import React from 'react'
import PropTypes from 'prop-types'

class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.listenKeyboard = this.listenKeyboard.bind(this)
    this.onOverlayClick = this.onOverlayClick.bind(this)
  }

  listenKeyboard(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    if (this.props.onClose) {
      window.addEventListener('keydown', this.listenKeyboard, true)
    }
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      window.removeEventListener('keydown', this.listenKeyboard.bind(this), true)
    }
  }

  onOverlayClick() {
    this.props.onClose()
  }

  onDialogClick(event) {
    event.stopPropagation()
  }

  render() {
    return (
      <div>
        <div className="modal-overlay-div" />
        <div className="modal-content-div" onClick={this.onOverlayClick}>
          <div className="modal-dialog-div" onClick={this.onDialogClick}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  onClose: PropTypes.func
}

export default Modal
