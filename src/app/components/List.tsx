import React from "react";
import Card from "./Card";

type CardType = { id: string; text: string };
type ListType = { id: string; title: string; cards: CardType[] };

interface ListProps {
  list: ListType;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const List: React.FC<ListProps> = ({ list, setPoints }) => {
  return (
    <>
      <h3>{list.title}</h3>
      {list.cards.map((card, index) => (
        <Card key={card.id} card={card} index={index} setPoints={setPoints} />
      ))}
    </>
  );
};

export default List;
