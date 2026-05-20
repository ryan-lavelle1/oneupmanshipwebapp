import React, { useState } from 'react';
import './SpacePrompt.css';

const SellStockPrompt = ({ companies, onClose, onSell }) => {
  const [quantity, setQuantity] = useState(0);
  const [companyName, setCompanyName] = useState("AUH2O");

  console.log("Companies: ", companies);

  const handleSell = () => {
    const compName = companyName;
    const qty = parseInt(quantity);

    console.log(companies.includes(compName));
    console.log("Company Name: ", compName)

    if (qty === null || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    onSell(compName, qty);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Sell Stock</h3>
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
          <button className="purchase-btn" onClick={handleSell}>Sell</button>
        </div>
      </div>
    </div>
  );
};

export default SellStockPrompt;