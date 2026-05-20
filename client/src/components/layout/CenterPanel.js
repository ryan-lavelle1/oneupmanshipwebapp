import React from 'react';
import './CenterPanel.css';

const CenterPanel = ({ children }) => {
  return (
    <div className="center-panel-inner">
      {children}
    </div>
  );
};

export default CenterPanel;