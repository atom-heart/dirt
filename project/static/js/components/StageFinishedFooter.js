import React from 'react';

const StageFinishedFooter = () => (
  <div className="alert border d-flex justify-content-between align-items-center">
    <span>Stage has finished!</span>
    <button
      onClick={() => window.scrollTo(0, 0)}
      className="btn btn-primary scroll-top"
    >
      Show ranking
    </button>
  </div>
);

export default StageFinishedFooter;
