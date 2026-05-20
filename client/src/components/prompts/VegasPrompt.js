import React, { useState } from 'react';
import './SpacePrompt.css';

const VegasPrompt = ({ playerList, onClose, onWager }) => {
  const [wager, setWager] = useState(0);
  const [targetId, setTargetId] = useState(0);

  const handleConfirm = () => {
    const qty = parseInt(wager);
    const tgt = parseInt(targetId);

    console.log("Target id (in prompt):", tgt);

    if (qty === null || qty <= 0) {
      alert("Invalid wager");
      return;
    }

    if (tgt === null) {
    alert("Invalid target");
      return;
    }
    
    onWager(tgt, qty);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Vegas</h3>
        <p>
          Target:{""}
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {playerList.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>
        </p>
        <p>Wager amount:</p>
        <input
          type="number"
          min="1"
          value={wager}
          onChange={(e) => setWager(e.target.value)}
        />
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default VegasPrompt;