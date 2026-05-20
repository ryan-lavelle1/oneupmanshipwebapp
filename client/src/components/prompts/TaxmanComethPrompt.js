import React, { useState } from 'react';
import './SpacePrompt.css';

const TaxmanComethPrompt = ({ cashOutValue, onConfirm }) => {
    return (
        <div className="stock-prompt-overlay">
            <div className="stock-prompt-content">
                <h3>Pay the Taxman</h3>
                <p>You owe ${(2*cashOutValue)/10}. Ha!</p>
                <div>
                <button className="purchase-btn" onClick={onConfirm}>Pay him</button>
                </div>
            </div>
        </div>
    );
};

export default TaxmanComethPrompt;