import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const toGame = () => {
    navigate('/game');
  };

  return (
    <div>
      <h1>Home page</h1>
      <button onClick={toGame}>Click here to go to /game</button>
    </div>
  );
};

export default Home;
