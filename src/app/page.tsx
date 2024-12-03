"use client";
import React, { useState } from "react";
import Board from "./components/Board";
import Gamification from "./components/Gamification";

const Home: React.FC = () => {
  const [points, setPoints] = useState(0);

  return (
    <div style={{ padding: "20px" }}>
      <Gamification points={points} />
      <Board setPoints={setPoints} />
    </div>
  );
};

export default Home;
