import React, { useState } from 'react'
import './Board.scss'
import List from '../List/List'
import { BoardType } from '../../types'

interface BoardProps {
  board: BoardType
  boards: BoardType[]

  updateBoards: (newBoards: BoardType[]) => Promise<void>
  selectedId: string
}

const Board: React.FC<BoardProps> = ({ board, boards, updateBoards, selectedId }) => {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  React.useEffect(() => {
    if (!adding) return
    const handleClick = (e: MouseEvent): void => {
      const form = document.querySelector('.add-list-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewTitle('')
      }
    }
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setAdding(false)
        setNewTitle('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [adding])

  const handleAddList = async (): Promise<void> => {
    if (newTitle.trim()) {
      setAdding(false)
      setNewTitle('')
      const newList = {
        id: Date.now().toString(),
        title: newTitle,
        time_stamp: Date.now().toString(),
        cards: [],
        done: false
      }
      // 构造新的 board
      const newBoard = { ...board, lists: [...board.lists, newList] }
      // 构造新的 boards 数组
      const newBoards = boards.map((b) => (b.id === selectedId ? newBoard : b))
      console.log('更新后的 boards:', newBoards)
      await updateBoards(newBoards)
    }
  }

  return (
    <div className="board">
      <div className="board-lists">
        {board.lists
          .filter((list) => !list.done)
          .map((list) => (
            <List
              key={list.id}
              boards={boards}
              boardId={board.id}
              list={list}
              updateBoards={updateBoards}
            />
          ))}
        {board.lists
          .filter((list) => list.done)
          .map((list) => (
            <List
              key={list.id}
              boards={boards}
              boardId={board.id}
              list={list}
              updateBoards={updateBoards}
            />
          ))}
        {/* 添加list按钮 */}
        <div className="list add-list">
          {adding ? (
            <div className="add-list-form">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="请输入列表标题"
                autoFocus
              />
              <button onClick={handleAddList}>确认</button>
            </div>
          ) : (
            <div className="add-list-title" onClick={() => setAdding(true)}>
              + 添加内容
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Board
