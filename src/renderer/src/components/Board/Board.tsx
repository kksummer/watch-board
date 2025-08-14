import React from 'react';
import './Board.scss';
import List from '../List/List';
import { BoardType } from '../../types';

interface BoardProps {
  board: BoardType;
}


const Board: React.FC<BoardProps> = ({ board }) => (
  <div className="board">
    <div className="board-lists">
      {board.lists.map(list => (
        <List key={list.id} list={list} />
      ))}
    </div>
  </div>
);

export default Board;
