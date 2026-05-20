import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Game from "./components/Game";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/game" element={<Game />} /> */}
        <Route path="/" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
