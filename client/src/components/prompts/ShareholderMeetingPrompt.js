import './SpacePrompt.css';

const ShareholderMeetingPrompt = ({ shareholderMeeting, onClose, onParticipate }) => {

  const handleParticipate = () => {
    onParticipate(1);
    onClose();
  };

  return (
    <div className="stock-prompt-overlay">
      <div className="stock-prompt-content">
        <h3>Participate in Shareholder Meeting</h3>
        <h3>(Must purchase 1 share)</h3>
        <p>Company: {shareholderMeeting.companyName}</p>
        <p>Price to join: ${shareholderMeeting.stockPrice}</p>
        <div>
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="purchase-btn" onClick={handleParticipate}>Participate</button>
        </div>
      </div>
    </div>
  );
};

export default ShareholderMeetingPrompt;