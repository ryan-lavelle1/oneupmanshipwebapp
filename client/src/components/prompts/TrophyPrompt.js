import React from 'react';
import './SpacePrompt.css';

const TrophyPrompt = ({ onClose, onPurchase }) => {

  const handlePurchase = () => {
    const qty = 1;
    if (qty === null || qty <= 0) {
      alert("Invalid quantity");
      return;
    }
    
    onPurchase(qty);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Purchase Trophy?</h3>
        <p>Price: ${2000}</p>
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handlePurchase}>Purchase</button>
        </div>
      </div>
    </div>
  );
};

export default TrophyPrompt;