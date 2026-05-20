import React from 'react';
import './PlayerList.css';

const PlayerList = ({ players, stockTracker }) => {
  const getStockValue = (player) => {
    let value = 0;
    for (const company in player.stocks) {
      value = value + (player.stocks[company] * stockTracker.stockPrices[stockTracker.index][company]);
    }
    return value;
  }

  if (players == null) {
    return (
      <div className="section">
        <h3>Players</h3>
        <strong>No players have joined</strong>
      </div>
    )
  }

  return (
    <div className="section">
      <h3>Players</h3>
      {players.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong><br />
          Cash: ${p.cash}<br />
          Stocks: ${getStockValue(p)}<br />
          Trophies: {p.trophies}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;