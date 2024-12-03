import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import List from "./List";
import Confetti from "react-confetti";
import useWindowSize from "./useWindowSize"; // Utility for responsive confetti sizing

type CardType = { id: string; text: string };
type ListType = { id: string; title: string; cards: CardType[] };

interface BoardProps {
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const Board: React.FC<BoardProps> = ({ setPoints }) => {
  const [lists, setLists] = useState<ListType[]>([
    { id: "1", title: "To Do", cards: [{ id: "c1", text: "Learn Next.js" }] },
    {
      id: "2",
      title: "In Progress",
      cards: [{ id: "c2", text: "Build a POC" }],
    },
    { id: "3", title: "Done", cards: [{ id: "c3", text: "Deploy App" }] },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize(); // For confetti size

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const listIndex = lists.findIndex(
        (list) => list.id === source.droppableId
      );
      const newCards = Array.from(lists[listIndex].cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newLists = [...lists];
      newLists[listIndex].cards = newCards;
      setLists(newLists);
    } else {
      const sourceListIndex = lists.findIndex(
        (list) => list.id === source.droppableId
      );
      const destListIndex = lists.findIndex(
        (list) => list.id === destination.droppableId
      );

      const sourceCards = Array.from(lists[sourceListIndex].cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      const destCards = Array.from(lists[destListIndex].cards);
      destCards.splice(destination.index, 0, movedCard);

      const newLists = [...lists];
      newLists[sourceListIndex].cards = sourceCards;
      newLists[destListIndex].cards = destCards;
      setLists(newLists);

      if (lists[destListIndex].title === "Done") {
        setPoints((prev) => prev + 10); // Add points
        triggerConfetti();
      }
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {showConfetti && <Confetti width={width} height={height} />}
      <div style={{ display: "flex", gap: "10px" }}>
        {lists.map((list) => (
          <Droppable key={list.id} droppableId={list.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "300px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                <List list={list} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
