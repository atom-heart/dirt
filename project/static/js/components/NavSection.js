import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavSection = (props) => {
  return (
    <ul className="nav flex-column nav-pills top-level-menu">
      {props.children}
    </ul>
  );
}

export default NavSection;
