import React, { useState } from 'react';
import './SpacePrompt.css';

const FeePrompt = ({ shareCount, onConfirm }) => {
    console.log('shareCount = ', shareCount);
    return (
        <div className="stock-prompt-overlay">
        <div className="stock-prompt-content">
            <h3>Pay a Fee</h3>
            <p>You owe ${10*shareCount}. Ha!</p>
            <div>
            <button className="purchase-btn" onClick={onConfirm}>Pay fee</button>
            </div>
        </div>
        </div>
    );
};

export default FeePrompt;