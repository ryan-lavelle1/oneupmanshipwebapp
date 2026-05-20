import React from 'react';
import './RightPanel.css';

const RightPanel = ({ children }) => {
  return (
    <div className="right-panel-inner">
      {children}
    </div>
  );
};

export default RightPanel;