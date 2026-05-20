import React, { useState } from 'react';
import './SpacePrompt.css';

const BonusPrompt = ({ onCW, onCCW }) => {
  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Choose direction:</h3>
        <button onClick={onCW}>Clockwise</button>
        <button onClick={onCCW}>Counterclockwise</button>
      </div>
    </div>
  );
};

export default BonusPrompt;