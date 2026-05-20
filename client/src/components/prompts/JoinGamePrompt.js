import React, { useState } from 'react';
import './SpacePrompt.css';

const JoinGamePrompt = ({ onJoin /*, onImport*/ }) => {

    const [name, setName] = useState("");

    const handleJoin = () => {
        if (name.trim() !== "") {
            onJoin(name);
        } else {
            alert("Try a different name");
            return;
        }
    }

    return (
        <div className="stock-prompt-overlay">
        <div className="stock-prompt-content">
            <h3>Join Game!</h3>
            <p>Enter display name</p>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div>
            <button className="purchase-btn" onClick={handleJoin}>Join!</button>
            </div>
        </div>
        </div>
    );
};

export default JoinGamePrompt;