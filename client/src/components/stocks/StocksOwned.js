import React, { useEffect, useState } from 'react';
import './StocksOwned.css';

const StocksOwned = ({ gameState, playerName }) => {
  // console.log("gameState:", gameState);

  let player = gameState.players.find(player => player.name === playerName);

  // console.log("playerName:", playerName);
  // console.log("player:", player);

  const [stockPrices, setStockPrices] = useState({});

  useEffect(() => {
    let stockTracker = gameState.stockTracker;
    if (stockTracker && player) {
      const prices = {};
      for (const company of Object.keys(player.stocks)) {
        const price = stockTracker.stockPrices[stockTracker.index][company];
        prices[company] = price;
      }
      setStockPrices(prices);
    }
  }, [gameState, player]);

  if (!player) {
    return <p>Player not found</p>;
  }

  const stocks = player.stocks ? Object.entries(player.stocks) : [];

  const renderStocks = () => {
    return stocks.map(([companyName, quantity]) => {
      const abbr = gameState.companyAbbr[companyName]
      const stockPrice = stockPrices[companyName] || 0;
      const totalValue = quantity * stockPrice;

      return (
        <div key={companyName}>
          <h4>{companyName} ({abbr})</h4>
          <p>Shares Owned: {quantity}</p>
          <p>Price per Share: ${stockPrice.toFixed(2)}</p>
          <p>Total Value: ${totalValue.toFixed(2)}</p>
        </div>
      );
    });
  };

  return (
    <div className="stocks-owned">
      <h3>Stocks Owned</h3>
      {renderStocks()}
    </div>
  );
};

export default StocksOwned;