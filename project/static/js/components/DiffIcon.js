import React, { Fragment } from 'react'

const DiffIcon = (props) => {
  if (props.diff == 0) {
    return <span>=</span>
  }

  else {
    const iconClass = props.diff > 0
      ? 'oi-caret-top text-success'
      : 'oi-caret-bottom text-danger'

    return (
      <Fragment>
        <span
          className={'oi ' + iconClass}
          style={{fontSize: '.7em'}}
        />
        <span style={{marginLeft: 5}}>
          {Math.abs(props.diff)}
        </span>
      </Fragment>
    )
  }
}

export default DiffIcon
