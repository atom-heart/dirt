import React from 'react'

const TableHeader = (props) => {
  return (
    <div
      className="card-header d-flex align-items-baseline justify-content-between"
    >
      <h4>
        {props.title}
      </h4>
      {props.subtitle &&
        <span className="text-muted weather">
          {props.subtitle}
        </span>
      }
    </div>
  )
}

export default TableHeader
