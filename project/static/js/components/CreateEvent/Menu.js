import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Sidebar from '../styled/Sidebar'
import SideHeading from '../styled/SideHeading'
import NavSection from '../NavSection'
import NavItem from '../NavItem'

import { Row } from 'reactstrap'

class Menu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Row>
        <Sidebar>
          <SideHeading text="Create an event" />
          
          <NavSection>
            <NavItem
              exact
              to="/create"
              text="Event"
            />
          </NavSection>
        </Sidebar>
      </Row>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
