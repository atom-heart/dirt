import React from 'react'

const styles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}

const PageLoader = () => {
  // return <div style={styles}>Loading...</div>
  return (
    <div style={styles}>
      <div className="spinner-grow text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default PageLoader
