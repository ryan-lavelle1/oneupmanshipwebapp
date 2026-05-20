import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import GameLayout from './layout/GameLayout';
import LeftPanel from './layout/LeftPanel';
import CenterPanel from './layout/CenterPanel';
import RightPanel from './layout/RightPanel';
import PlayerList from './players/PlayerList';
import GameLog from './log/GameLog';
import Board from './board/Board';
import StocksOwned from './stocks/StocksOwned';
import StockTracker from './stocks/StockTracker';
import ExportSection from './export/ExportSection';

import StockPrompt from './prompts/StockPrompt';
import SellStockPrompt from './prompts/SellStockPrompt';
import TrophyPrompt from './prompts/TrophyPrompt';
import WinGamePrompt from './prompts/WinGamePrompt';
import BitterPillPrompt from './prompts/BitterPillPrompt';
import WaitingForBitterPill from './prompts/WaitingForBitterPill';
import GameOverPrompt from './prompts/GameOverPrompt';
import ShareholderMeetingPrompt from './prompts/ShareholderMeetingPrompt';
import FeePrompt from './prompts/FeePrompt';
import RealEstatePurchasePrompt from './prompts/RealEstatePurchasePrompt';
import RealEstateUpgradePrompt from './prompts/RealEstateUpgradePrompt';
import BonusPrompt from './prompts/BonusPrompt';
import VegasPrompt from './prompts/VegasPrompt';
import TaxmanComethPrompt from './prompts/TaxmanComethPrompt';
import WildCardPrompt from './prompts/WildCardPrompt';


import JoinGamePrompt from './prompts/JoinGamePrompt';


const URL = "http://localhost:5000";
const socket = io(URL);

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  const [shareCount, setShareCount] = useState(0);
  const [cashOutValue, setCashOutValue] = useState(0.0);

  const [stock, setStock] = useState(null);
  const [shareholderMeeting, setShareholderMeeting] = useState(null);
  const [realEstate, setRealEstate] = useState(null);

  const [exportCode, setExportCode] = useState("");
  const [importCode, setImportCode] = useState("");
  const [playersToChoose, setPlayersToChoose] = useState([]);

  const [stockPromptVisible, setStockPromptVisible] = useState(false);
  const [shareholderMeetingPromptVisible, setShareholderMeetingPromptVisible] = useState(false);
  const [trophyPromptVisible, setTrophyPromptVisible] = useState(false);
  const [feePromptVisible, setFeePromptVisible] = useState(false);
  const [sellStockPromptVisible, setSellStockPromptVisible] = useState(false);
  const [winGamePromptVisible, setWinGamePromptVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState("");
  const [bitterPillPromptVisible, setBitterPillPromptVisible] = useState(false);
  const [waitingForBitterPillVisible, setWaitingForBitterPillVisible] = useState(false);
  const [purchaseRealEstatePromptVisible, setPurchaseRealEstatePromptVisible] = useState(false);
  const [upgradeRealEstatePromptVisible, setUpgradeRealEstatePromptVisible] = useState(false);
  const [bonusPromptVisible, setBonusPromptVisible] = useState(false);
  const [vegasPromptVisible, setVegasPromptVisible] = useState(false);
  const [taxmanComethPromptVisible, setTaxmanComethPromptVisible] = useState(false);
  const [wildCardPromptVisible, setWildCardPromptVisible] = useState(false);

  const [joinGamePromptVisible, setJoinGamePromptVisible] = useState(true);

  const CLOCKWISE = 1;
  const COUNTERCLOCKWISE = -1;
  
  console.log("Client started", socket.id);

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Client connected");
    });

    socket.on('gameState', (state) => {
      console.log("Game state: ", state);
      setGameState(state);
    });

    socket.on('gameOver', (winnerName) => {
      setWaitingForBitterPillVisible(false);
      setGameOverVisible(winnerName);
    });

    socket.on('logMessage', (message) => {
      setGameLog(current => [...current, message]);
    });

    socket.on('exportGameLog', (code) => {
      setExportCode(code);
    });

    socket.on('importGameLog', () => {
      alert("Game successfully imported");
    });

    socket.on('choosePlayer', ({ players }) => {
      setPlayersToChoose(players);
    });

    socket.on('promptSellStock', () => {
      console.log("Selling stock");
      setSellStockPromptVisible(true);
      console.log("Sell stock prompt visibility has been set to true");
    });

    socket.on('promptWinGame', () => {
      console.log("Winning game");
      setWinGamePromptVisible(true);
      console.log("Win game prompt visibility has been set to true");
    });

    socket.on('promptBitterPill', () => {
      setBitterPillPromptVisible(true);
    });

    socket.on('waitingForBitterPill', () => {
      setWaitingForBitterPillVisible(true);
    });

    socket.on('bitterPillTaken', ({ pillTakerName }) => {
      setWaitingForBitterPillVisible(false);
      setBitterPillPromptVisible(false);
      alert(`${pillTakerName} has taken the BITTER PILL!`);
    });

    socket.on('promptStockSpaceEffect', ({ companyName, stockPrice }) => {
      console.log("Received stock prompt:", companyName, stockPrice);
      setStock({ companyName, stockPrice, quantity: 0 });
      setStockPromptVisible(true);
      console.log("Stock prompt visibility has been set to true");
    });

    socket.on('promptShareholderMeetingSpaceEffect', ({ companyName, stockPrice }) => {
      console.log("Received shareholder meeting prompt:", companyName, stockPrice);
      setShareholderMeeting({ companyName, stockPrice });
      setShareholderMeetingPromptVisible(true);
    });

    socket.on('promptVegasSpaceEffect', () => {
      console.log("Received vegas prompt");
      setVegasPromptVisible(true);
    })

    socket.on('promptRealEstateSpaceEffect', ({ property, floors, playerId }) => {
      console.log("Received real estate prompt:", property);
      setRealEstate({ property, floors, playerId });
      console.log("playerId: ", playerId);
      console.log("property owner: ", property.owner);

      if (property.owner == null) {
        setPurchaseRealEstatePromptVisible(true);
      } else if (property.owner == playerId) {
        setUpgradeRealEstatePromptVisible(true);
      } else {
        socket.emit('realEstateSpaceEffect', ({ property }));
      }
    });

    socket.on('promptFeeSpaceEffect', (shareCount) => {
      setShareCount(shareCount)
      setFeePromptVisible(true);
    });

    socket.on('promptTaxmanComethSpaceEffect', (cashOutValue) => {
      console.log("value (Game.js line 193):", cashOutValue);
      setCashOutValue(cashOutValue);
      setTaxmanComethPromptVisible(true);
    });

    socket.on('promptBonusSpaceEffect', () => {
      setBonusPromptVisible(true);
    });

    socket.on('promptDollarSpaceEffect', () => {
      socket.emit('dollarSpaceEffect');
    });

    socket.on('promptFreeLunchSpaceEffect', () => {
      socket.emit('freeLunchSpaceEffect');
    });

    socket.on('promptTrophySpaceEffect', () => {
      console.log("Received trophy prompt");
      setTrophyPromptVisible(true);
    });

    socket.on('promptWildCardSpaceEffect', ({ companyName, stockPrice }) => {
      console.log("Received wild card prompt:", companyName, stockPrice);
      setStock({ companyName: null, stockPrice, quantity: 0 });
      console.log("Stock has been set:", stock);
      setWildCardPromptVisible(true);
    });

    socket.on('purchaseFailed', ({ reason }) => {
      alert(`Purchase failed: ${reason}`);
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
      socket.off('logMessage');
      socket.off('exportGameLog');
      socket.off('importGameLog');
      socket.off('choosePlayer');
      socket.off('promptSellStock');
      socket.off('promptWinGame');
      socket.off('promptBitterPill');
      socket.off('waitingForBitterPill');
      socket.off('bitterPillTaken');
      socket.off('promptStockSpaceEffect');
      socket.off('promptShareholderMeetingSpaceEffect');
      socket.off('promptRealEstateSpaceEffect');
      socket.off('promptBonusSpaceEffect');
      socket.off('promptDollarSpaceEffect');
      socket.off('promptFeeSpaceEffect');
      socket.off('promptTrophySpaceEffect');
      socket.off('promptVegasSpaceEffect');
      socket.off('promptDoOrDieSpaceEffect');
      socket.off('promptWildCardSpaceEffect');
      socket.off('purchaseFailed');
      socket.off('realEstateSpaceEffect');
      socket.off('promptFreeLunchSpaceEffect');
    }
  }, []);

  const joinGame = (name) => {
    console.log("Got name:", name);
    let playerList = [];
    for (let player of gameState.players) {
      playerList.push(player.name);
    }

    if (name.trim() !== "" && !playerList.includes(name.trim())) {
      socket.emit('joinGame', name);
      setPlayerName(name);
      setIsJoined(true);
      setJoinGamePromptVisible(false);
    } else {
      alert("Try a different name");
    }
  };

  const exportGame = () => {
    console.log("\n\n Export button clicked \n");
    socket.emit('exportGame');
  }

  const importGame = () => {
    const log = JSON.parse(importCode);

    socket.emit('importGame', {
      gameLog: log
    });
  }

  const handlePlayerSelect = (playerId, name) => {
    setPlayerName(name);
    socket.emit('playerSelected', { playerId });
    setPlayersToChoose([]);
  };

  // Stock
  const purchaseStock = (companyName, quantity) => {
    if (quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    console.log("Stock", stock);
    console.log("companyName", companyName);

    if (stock.companyName !== null) { // Normal stock purchase
      socket.emit('stockSpaceEffect', {
        companyName: stock.companyName,
        quantity: quantity,
      });
    } else { // Wild card stock purchase
      socket.emit('wildCardSpaceEffect', {
        companyName: companyName,
        quantity: quantity,
      });
    }
    // setStockPromptVisible(false);
  };

  const sellStock = (companyName, quantity) => {
    if (quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (!gameState.companies.includes(companyName)) {
      alert("Invalid company");
      return;
    }

    socket.emit('sellStockEffect', {
      companyName: companyName,
      quantity: quantity,
    });
  }

  const winGame = () => {
    console.log('win game pressed');
    socket.emit('winGameEffect');
  }

  // Vegas
  const wager = (targetId, amount) => {
    console.log("TargetId:", targetId);

    if (amount <= 0) {
      alert("Invalid amount");
      return;
    }
    socket.emit('vegasSpaceEffect', {
      targetId: targetId,
      amount: amount,
    });
  }

  const respondToBitterPill = (response) => {
    socket.emit('bitterPillResponse', response);
    setBitterPillPromptVisible(false);
  }

  // Shareholder meeting
  const participateInMeeting = () => {
    socket.emit('shareholderMeetingSpaceEffect', {
      companyName: shareholderMeeting.companyName,
    });
    setShareholderMeeting(null);
  }

  // Real estate
  const confirmRealEstate = () => {
    console.log("Real estate: ", realEstate);
    socket.emit('purchaseRealEstate', {
      property: realEstate.property,
    });
    // setRealEstate(null);
    setPurchaseRealEstatePromptVisible(false);
  }

  // Trophy
  const purchaseTrophy = () => {
    socket.emit('trophySpaceEffect', {
      decision: true,
    });
    setTrophyPromptVisible(false);
  }

  const payFee = () => {
    socket.emit('payFeeEffect');
    setFeePromptVisible(false);
  }

  const payTaxmanCometh = () => {
    socket.emit('payTaxmanComethEffect');
    setTaxmanComethPromptVisible(false);
  }

  const chooseCW = () => {
    socket.emit('bonusSpaceEffect', {
      decision: CLOCKWISE
    });
    setBonusPromptVisible(false);
  }

  const chooseCCW = () => {
    socket.emit('bonusSpaceEffect', {
      decision: COUNTERCLOCKWISE
    });
    setBonusPromptVisible(false);
  }


  // Close prompts
  const closeStockPrompt = () => {
    setStockPromptVisible(false);
  };

  const closeWildCardPrompt = () => {
    setWildCardPromptVisible(false);
  }

  const closeSellStockPrompt = () => {
    setSellStockPromptVisible(false);
  }

  const closeWinGamePrompt = () => {
    setWinGamePromptVisible(false);
  }

  const closeShareholderMeetingPrompt = () => {
    setShareholderMeetingPromptVisible(false);
  };

  const closeTrophyPrompt = () => {
    setTrophyPromptVisible(false);
  }

  const closePurchaseRealEstatePrompt = () => {
    setPurchaseRealEstatePromptVisible(false);
  }

  const closeVegasPrompt = () => {
    setVegasPromptVisible(false);
  }


  let isPlayerTurn = false;
  let playerCanWin = false;

  if (gameState && gameState.players && gameState.players[gameState.playerTurn]) {
      isPlayerTurn = 
        gameState && gameState.players[gameState.playerTurn].name === playerName;

      if (gameState) {
        const player = gameState.players[gameState.playerTurn];
        let playerIsFirst = true;

        for (let p of gameState.players) {
          if (p.cash > player.cash) {
            playerIsFirst = false;
            break;
          }
        }
        
        playerCanWin = (player.cash >= 100000) && playerIsFirst;
    }
  }

  if (!gameState) {
    socket.emit('getGameState');
  }


  // Render the screen

  if (!gameState) {
    return (
      <>
        <h1>Loading...</h1>
        <button onClick={() => socket.emit('getGameState')}>
          Reload
        </button>
      </>
    )
  } else {
    return (
      <>
        <GameLayout
          left={
            <LeftPanel>
              <div className="left-panel-section">
                <PlayerList
                  players={gameState.players}
                  stockTracker={gameState.stockTracker}
                  />
              </div>
              <div className="left-panel-section grow">
                <GameLog log={gameLog} />
              </div>

              <div className="left-panel-section">
                <ExportSection exportGame={exportGame} exportCode={exportCode} />
              </div>
            </LeftPanel>
          }
          center={
            <CenterPanel>
              <div className="center-overlay">
                <StockTracker stockTracker={gameState.stockTracker}/> 
                {isPlayerTurn && (
                  <>
                    <button onClick={() => socket.emit('rollDice')}>Roll Dice!</button>
                    <button onClick={() => socket.emit('sellStock')}>Sell Stock</button>
                    {playerCanWin && <button onClick={() => socket.emit('winGame')}>Win Game</button>}
                  </>
                )}
              </div>

                <Board boardSpaces={gameState.board} gameState={gameState} />
            </CenterPanel>
          }
          right={
            <RightPanel>
              <div className="right-panel-section grow">
                <StocksOwned gameState={gameState} playerName={playerName} />
              </div>
            </RightPanel>
          }
        />

        {joinGamePromptVisible && (
          <JoinGamePrompt
            onJoin={joinGame}
            // onImport={importGame}
          />
        )}

        {sellStockPromptVisible && (
          <SellStockPrompt
            companies={gameState.companies}
            onClose={closeSellStockPrompt}
            onSell={sellStock}
          />
        )}

        {winGamePromptVisible && (
          <WinGamePrompt
            onClose={closeWinGamePrompt}
            onWin={winGame}
          />
        )}

        {bitterPillPromptVisible && (
          <BitterPillPrompt
            onTake={() => respondToBitterPill(true)}
            onPass={() => respondToBitterPill(false)}
          />
        )}

        {waitingForBitterPillVisible && (
          <WaitingForBitterPill />
        )}

        {stockPromptVisible && (
          <StockPrompt
            stock={stock}
            onClose={closeStockPrompt}
            onPurchase={purchaseStock}
          />
        )}

        {wildCardPromptVisible && (
          <WildCardPrompt
            companies={gameState.companies}
            onClose={closeWildCardPrompt}
            onPurchase={purchaseStock}
          />
        )}

        {shareholderMeetingPromptVisible && (
          <ShareholderMeetingPrompt
            shareholderMeeting={shareholderMeeting}
            onClose={closeShareholderMeetingPrompt}
            onParticipate={participateInMeeting}
          />
        )}

        {vegasPromptVisible && (
          <VegasPrompt
            playerList = {gameState.players}
            onClose={closeVegasPrompt}
            onWager={wager}
          />
        )}

        {trophyPromptVisible && (
          <TrophyPrompt
            onClose={closeTrophyPrompt}
            onPurchase={purchaseTrophy}
          />
        )}

        {purchaseRealEstatePromptVisible && (
          <RealEstatePurchasePrompt
            property={realEstate.property}
            onClose={closePurchaseRealEstatePrompt}
            onConfirm={confirmRealEstate}
          />
        )}

        {upgradeRealEstatePromptVisible && (
          <RealEstateUpgradePrompt
            property={realEstate.property}
            onClose={closePurchaseRealEstatePrompt}
            onConfirm={confirmRealEstate}
          />
        )}

        {feePromptVisible && (
          <FeePrompt
            shareCount={shareCount.shareCount}
            onConfirm={payFee}
          />
        )}

        {taxmanComethPromptVisible && (
          <TaxmanComethPrompt
            cashOutValue={cashOutValue.cashOutValue}
            onConfirm={payTaxmanCometh}
          />
        )}

        {bonusPromptVisible && (
          <BonusPrompt
            onCW={chooseCW}
            onCCW={chooseCCW}
          />
        )}

        {gameOverVisible !== "" && (
          <GameOverPrompt
            winnerName={gameOverVisible}
          />
        )}
      </>
    );
  };
};

export default Game;