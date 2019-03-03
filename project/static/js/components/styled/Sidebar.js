import React from 'react'

const SideNav = (props) => {
  return (
    <nav id="sidebar" className="col-4">
      {props.children}
    </nav>
  )
}

export default SideNav
