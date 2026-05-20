import React, { useState } from 'react';
import './SpacePrompt.css';

const BitterPillPrompt = ({ onTake, onPass }) => {
  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Take the bitter pill?</h3>
        <button onClick={onTake}>YES!</button>
        <button onClick={onPass}>Chicken out</button>
      </div>
    </div>
  );
};

export default BitterPillPrompt;