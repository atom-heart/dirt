import React from 'react';

import { Jumbotron } from 'reactstrap';

const styles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}

const PageLoader = (props) => {
  return <div style={styles}>Loading...</div>
}

export default PageLoader;
