import React, { useState } from 'react';
import './SpacePrompt.css';

const WaitingForBitterPillVisible = () => {
  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Waiting for player responses...</h3>
      </div>
    </div>
  );
};

export default WaitingForBitterPillVisible;