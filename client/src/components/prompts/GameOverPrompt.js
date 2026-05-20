import './SpacePrompt.css';

const GameOverPrompt = ({ winnerName }) => {

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Game over.</h3>
        <h3>Winner: {winnerName}!</h3>
      </div>
    </div>
  );
};

export default GameOverPrompt;