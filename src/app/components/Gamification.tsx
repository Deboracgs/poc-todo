import React from "react";

interface GamificationProps {
  points: number;
}

const Gamification: React.FC<GamificationProps> = ({ points }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Gamification</h2>
      <p>Points: {points}</p>
    </div>
  );
};

export default Gamification;
