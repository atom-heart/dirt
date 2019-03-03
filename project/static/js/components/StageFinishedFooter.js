import React from 'react'

import { Card } from 'reactstrap'

const StageFinishedFooter = () => (
  <Card>
    <div className="card-footer d-flex align-items-center" style={{borderTop: 0, background: 'transparent'}}>
      <span style={{width: '100%', textAlign: 'center'}}>Stage has finished!</span>
      <button
        onClick={() => window.scrollTo(0, 0)}
        className="btn btn-link progress-toggle"
        style={{borderLeft: '1px solid #dedede', borderRadius: 0}}
      >
        Go to ranking
      </button>
    </div>
  </Card>
)

export default StageFinishedFooter
