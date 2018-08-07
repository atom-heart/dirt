import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Jumbotron } from 'reactstrap';

class App extends React.Component {
  render() {
    return (
      <Jumbotron>
        <h1>Hello!</h1>
      </Jumbotron>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
