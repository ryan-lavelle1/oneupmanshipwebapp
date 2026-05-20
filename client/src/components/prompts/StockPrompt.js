import React, { useState } from 'react';
import './SpacePrompt.css';

const StockPrompt = ({ stock, onClose, onPurchase }) => {
  const [quantity, setQuantity] = useState(stock.quantity || 0);

  const handlePurchase = () => {
    const qty = parseInt(quantity);
    if (qty === null || qty <= 0) {
      alert("Invalid quantity");
      return;
    }
    
    onPurchase(null, qty);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Purchase Stock</h3>
        <p>Company: {stock.companyName}</p>
        <p>Price per share: ${stock.stockPrice}</p>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handlePurchase}>Purchase</button>
        </div>
      </div>
    </div>
  );
};

export default StockPrompt;