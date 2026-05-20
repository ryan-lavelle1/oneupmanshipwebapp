import React from 'react';
import './LeftPanel.css';

const LeftPanel = ({ children }) => {
  return (
    <div className="left-panel-inner">
      {children}
    </div>
  );
};

export default LeftPanel;