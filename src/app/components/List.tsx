import React from "react";
import { Draggable } from "react-beautiful-dnd";

type CardType = {
  id: string;
  text: string;
  dueDate: Date;
};

type ListType = {
  id: string;
  title: string;
  cards: CardType[];
};

interface ListProps {
  list: ListType;
}

const List: React.FC<ListProps> = ({ list }) => {
  return (
    <div>
      <h3>{list.title}</h3>
      {list.cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                padding: "10px",
                margin: "5px 0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                ...provided.draggableProps.style,
              }}
            >
              <p>{card.text}</p>
              <small>Due: {card.dueDate.toDateString()}</small>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default List;
