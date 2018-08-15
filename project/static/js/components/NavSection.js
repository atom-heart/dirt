import React from 'react';
import PropTypes from 'prop-types';

import NavItem from './NavItem';

const NavSection = (props) => {
  let links = props.items.map((item) => (
    <NavItem key={item.id} label={item.country} />
  ));

  return (
    <ul className="nav flex-column nav-pills top-level-menu">
      {links}
    </ul>
  );
}

NavSection.propTypes = {
  items: PropTypes.array.isRequired
}

export default NavSection;
