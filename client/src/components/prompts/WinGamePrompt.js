import React, { useState } from 'react';
import './SpacePrompt.css';

const WinGamePrompt = ({ onClose, onWin }) => {

  const handleWin = () => {
    onWin();
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Win the Game?</h3>
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handleWin}>Win!</button>
        </div>
      </div>
    </div>
  );
};

export default WinGamePrompt;