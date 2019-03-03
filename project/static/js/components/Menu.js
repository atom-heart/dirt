import React from 'react'
import { connect } from 'react-redux'

import Sidebar from './styled/Sidebar'
import SideHeading from './styled/SideHeading'
import NavSection from './NavSection'
import NavItem from './NavItem'

class Menu extends React.Component {
  render() {
    let stages = this.props.stageIds.map((id) => {
      const stage = this.props.stages[id]

      return (
        <NavItem
          exact
          to={`/event/${this.props.eventId}/${stage.order}`}
          text={stage.country}
          key={stage.id}
        />
      )
    })

    return (
      <Sidebar>
        <SideHeading text={this.props.eventName} />
        
        <NavSection>
          <NavItem
            exact
            to={`/event/${this.props.eventId}`}
            text="Event"
          />
        </NavSection>

        <NavSection>
          {stages}
        </NavSection>

        {this.props.eventFinished &&
          <NavSection>
            <NavItem
              exact
              to={`/event/${this.props.eventId}/standings`}
              text="Standings"
            />
          </NavSection>
        }
      </Sidebar>
    )
  }
}

const mapStateToProps = state => ({
  eventFinished: state.event.finished,
  stages: state.stages.byId,
  stageIds: state.stages.allIds
})

export default connect(mapStateToProps, null, null, {pure: false})(Menu)
