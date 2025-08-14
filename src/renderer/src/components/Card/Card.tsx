import React from 'react';
import './Card.scss';
import { CardType } from '../../types';

interface CardProps {
  card: CardType;
}


const Card: React.FC<CardProps> = ({ card }) => (
  <div className="card">
    <div className="card-desc">{card.desc}</div>
  </div>
);

export default Card;
