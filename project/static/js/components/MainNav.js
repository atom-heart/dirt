import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem
} from 'reactstrap'

class MainNav extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <Navbar className="shadow-sm" light expand="md" style={{borderBottom: '1px solid #e6e6e6'}}>
        <Container style={{maxWidth: 900}}>
          <NavLink className="navbar-brand" to="/">(App)</NavLink>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link" to="/events">Events</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/new">New event</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default MainNav
