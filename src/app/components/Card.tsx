import React from "react";
import { Draggable } from "react-beautiful-dnd";

type CardType = { id: string; text: string };

interface CardProps {
  card: CardType;
  index: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const Card: React.FC<CardProps> = ({ card, index, setPoints }) => {
  const handleComplete = () => {
    setPoints((prev) => prev + 10); // Gamification: add points
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            padding: "10px",
            border: "1px solid #000",
            marginBottom: "5px",
            backgroundColor: "#fff",
            borderRadius: "4px",
          }}
        >
          <p>{card.text}</p>
          <button onClick={handleComplete}>Complete Task</button>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
