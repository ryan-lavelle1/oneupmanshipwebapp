import React, { useState } from 'react';
import './SpacePrompt.css';

const RealEstatePurchasePrompt = ({ property, onClose, onConfirm }) => {

  const handlePurchase = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Purchase Property</h3>
        <p>{property.name}</p>
        <p>Initial rent: ${property.initialRent}</p>
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handlePurchase}>Purchase</button>
        </div>
      </div>
    </div>
  );
};

export default RealEstatePurchasePrompt;