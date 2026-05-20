import React, { useState } from 'react';
import './SpacePrompt.css';

const WildCardPrompt = ({ companies, onClose, onPurchase }) => {
  const [quantity, setQuantity] = useState(0);
  const [companyName, setCompanyName] = useState("AUH2O");

  const handlePurchase = () => {
    const compName = companyName;
    const qty = parseInt(quantity);

    if (qty === null || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    onPurchase(compName, qty);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Purchase Stock</h3>
        <p>
          Company:{" "}
          <select
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          >
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </p>

        <p>
          Quantity:{" "}
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </p>
        
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handlePurchase}>Buy</button>
        </div>
      </div>
    </div>
  );
};

export default WildCardPrompt;