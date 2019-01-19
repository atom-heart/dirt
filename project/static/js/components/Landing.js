import React from 'react'
import { NavLink } from 'react-router-dom'

class Landing extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{height: 'calc(100% - 79px)'}} className="d-flex align-items-center">
        <div>
          <h1 className="display-3" style={{fontSize: '4em', marginBottom: '1.2rem'}}>Welcome to the (App) demo!</h1>
          <p className="lead">This app is an extension to modern rally racing games. It lets you compete with your friends in a championship together, by doing all the dirty work for you, like calculating time differences and assigning point.</p>
          <p className="lead">
            It's still very much work in progress. The part of the code that I'm not ashamed of can be found in the master branch of <a href="https://github.com/atom-heart/rally">this repo</a>. The hacked and ugly, put together for a purpose of this demo, can be found in the &quot;demo&quot; branch of the same repo. It will be taken care of. Italian mafia style.
          </p>
          <p className="lead">Now go ahead, and try it!</p>
          <p className="lead">
            <NavLink
              className="btn btn-lg btn-primary"
              style={{marginTop: 5}}
              to="/new"
            >
              Create an event
            </NavLink>
          </p>
        </div>
      </div>
    )
  }
}

export default Landing
