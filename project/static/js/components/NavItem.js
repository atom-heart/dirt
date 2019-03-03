import React from 'react'

import { NavLink } from 'react-router-dom'

const NavItem = (props) => {
  return (
    <li className="nav-item">
      <NavLink
        exact={props.exact}
        to={props.to}
        className="nav-link"
      >
        {props.text}
      </NavLink>
    </li>
  )
}

export default NavItem
