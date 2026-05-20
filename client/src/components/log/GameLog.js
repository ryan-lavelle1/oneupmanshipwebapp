import React from 'react';
import './GameLog.css';

const GameLog = ({log}) => {
    return (
      <div className="left-panel-section grow">
        <h3>Game Log</h3>
        <div className="game-log">
          {log.map((entry, index) => (
            <p key={index}>
              {entry}
            </p>
          ))}
        </div>
      </div>
    );
  };

export default GameLog;