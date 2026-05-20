import React from 'react';
import './StockTracker.css';

const StockTracker = ({ stockTracker }) => {
  let stockPrices = stockTracker.stockPrices;
  let currentIndex = stockTracker.index;
  let companies = stockTracker.companies;

  const startIndex = Math.max(0, currentIndex - 2);
  const endIndex = Math.min(stockPrices.length - 1, currentIndex + 2);

  return (
    <div className="section">
      <h3>Stock Tracker</h3>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            {Array.from({ length: endIndex - startIndex + 1 }, (_, i) => (
              <th key={i}>Index {startIndex + i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company}>
              <td>{company}</td>
              {stockPrices.slice(startIndex, endIndex + 1).map((entry, i) => (
                <td
                  key={i}
                  className={startIndex + i === currentIndex ? 'current' : ''}
                >
                  {entry[company] !== undefined ? entry[company] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTracker;