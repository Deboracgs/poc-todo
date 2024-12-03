"use client";
import React, { useState } from "react";
import Board from "./components/Board";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Board />
    </div>
  );
};

export default Home;
