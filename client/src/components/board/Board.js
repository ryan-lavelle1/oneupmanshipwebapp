import React from 'react';
import './Board.css';

function getGridPosition(id) {
  if (id <= 11) return { row: 13, col: 13 - id };
  if (id <= 21) return { row: 13 - (id - 11), col: 2 };
  if (id <= 33) return { row: 2, col: id - 22 + 2 };
  return { row: id - 33 + 2, col: 13 };
}

function getEdge(id) {
  if (id <= 11) return "bottom";
  if (id <= 21) return "left";
  if (id <= 33) return "top";
  return "right";
}

function getExtensionPosition(row, col, edge) {
  switch (edge) {
    case "bottom":
      return { row: row + 1, col };
    case "top":
      return { row: row - 1, col };
    case "left":
      return { row, col: col - 1 };
    case "right":
      return { row, col: col + 1 };
    default:
      return { row, col };
  }
}

function getSpaceColor(space) {
  const companyColors = {
    "AUH2O": "red",
    "Dough, Ray & Me": "orange",
    "fiasCo.": "yellow",
    "Acme": "limegreen",
    "Cataldo Supply": "blue",
    "JETCETERA": "purple"
  };

  switch (space.type) {
    case "StockSpace":
    case "ShareholderMeetingSpace":
      return companyColors[space.companyName] || "white";
    case "RealEstateSpace":
      return "grey";
    case "BonusSpace":
      return "white";
    case "DollarSpace":
      return "forestgreen";
    case "TrophySpace":
      return "lightyellow";
    case "DoOrDieSpace":
    case "VegasSpace":
      return "darkred";
    case "WildCardSpace":
      return "white";
    case "TaxmanComethSpace":
    case "BrokerFeeSpace":
    case "BlackThursdaySpace":
      return "black";
    default:
      return "white";
  }
}

// →  ↑  ←  ↓

function getArrowDirection(edge, direction) {
  switch (edge) {
    case "bottom": 
      return direction === 1 ? "←" : "→";
    case "left": 
      return direction === 1 ? "↑" : "↓";
    case "top": 
      return direction === 1 ? "→" : "←";
    case "right": 
      return direction === 1 ? "↓" : "↑";
    default:
      return direction === 1 ? "←" : "→";
  }
}

const Board = ({ boardSpaces, gameState }) => {
  return (
    <div className="board">
      {boardSpaces.map((space) => {
        if (!space) return null;

        const { row, col } = getGridPosition(space.id);
        const edge = getEdge(space.id);
        const direction = space.direction;
        const extPos = getExtensionPosition(row, col, edge);
        const directionArrow = getArrowDirection(edge, direction);

        const playersHere = gameState.players.filter(p => p.position === space.id);

        const bgColor = getSpaceColor(space);
        
        let fontColor;
        if (
          bgColor === "black" || 
          bgColor === "darkred" || 
          bgColor === "blue" || 
          bgColor === "purple"
        ) {
          fontColor = "white";
        } else { 
          fontColor = "black"; 
        }

        let displayType = space.type.replace(/Space$/, "");
        
        if (displayType === "ShareholderMeeting") {
          displayType = "Meet SHs";
        }

        if (displayType === "RealEstate") {
          displayType = "Property";
        }

        if (displayType === "TaxmanCometh") {
          displayType = "Taxman";
        }

        if (displayType === "BlackThursday") {
          displayType = "Black Th.";
        }
        // console.log(space.id, space.type, space.companyName, bgColor);
        
        return (
          <div
            key={space.id}
            className="space-wrapper"
            style={{ display: "contents" }}
          >
            <div
              key={space.id}
              className="space"
              style={{ gridRow: row, gridColumn: col, backgroundColor: bgColor, color: fontColor }}
            >
              <div className="space-info">
                {displayType}
                {space.type !== "BonusSpace" && (
                  <>
                    <br />
                    Shift: {space.stockChange}
                  </>
                )}

                {space.type === "StockSpace" && (
                  <>
                    <br />
                    {gameState.companyAbbr[space.companyName]} <br />
                    Div. : ${space.dividend}
                  </>
                )}

                {space.type === "ShareholderMeetingSpace" && (
                  <>
                    <br />
                    {gameState.companyAbbr[space.companyName]} <br />
                    Div. : ${space.dividend} <br />
                  </>
                )}

                {space.type === "RealEstateSpace" && space.realEstate && (
                  <>
                    <br />
                    {space.realEstate.name} <br />
                  </>
                )}

              </div>
            </div>

            <div
              className="extension-space"
              style={{ gridRow: extPos.row, gridColumn: extPos.col, backgroundColor: "transparent", color: "black" }}
            >
              <div className="extension-space-info">
                {directionArrow}
              </div>

              <div className="players">
                {playersHere.map((p) => (
                  <div key={p.id} className="token">
                    {p.name}
                  </div>
                ))}
              </div>
            </div> 
          </div>
        );
      })}
    </div>
  );
};

export default Board;