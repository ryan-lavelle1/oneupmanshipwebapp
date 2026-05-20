import React, { useRef } from 'react';
import './ExportSection.css';

const ExportSection = ({ exportGame, exportCode }) => {
  const textareaRef = useRef(null);

  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      alert('Game code copied!');
    }
  };

  return (
    <div className="section">
      <h3>Export Game</h3>
      <button onClick={exportGame}>Export</button>
      {exportCode && (
        <>
          <textarea ref={textareaRef} value={exportCode} readOnly rows={6} />
          <button onClick={copyToClipboard}>Copy</button>
        </>
      )}
    </div>
  );
};

export default ExportSection;