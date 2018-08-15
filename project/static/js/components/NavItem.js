import React from 'react';
import PropTypes from 'prop-types';

const NavItem = props => (
  <li className="nav-item">
    <a className="nav-link">{props.label}</a>
  </li>
);

NavItem.propTypes = {
  label: PropTypes.string.isRequired
}

export default NavItem;
