import React from 'react';
import './GameLayout.css';

const GameLayout = ({ left, center, right }) => {
    return (
      <div className="game-container">
        <div className="left-panel">{left}</div>
        <div className="center-panel">{center}</div>
        <div className="right-panel">{right}</div>
      </div>
    );
  };

export default GameLayout;