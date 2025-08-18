import React, { useState } from 'react'
import './Board.scss'
import List from '../List/List'
import { BoardType } from '../../types'

interface BoardProps {
  board: BoardType
}

const Board: React.FC<BoardProps> = ({ board }) => {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  React.useEffect(() => {
    if (!adding) return
    const handleClick = (e: MouseEvent) => {
      const form = document.querySelector('.add-list-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewTitle('')
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
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

  const handleAddList = () => {
    if (newTitle.trim()) {
      // 实际应调用父组件方法
      setAdding(false)
      setNewTitle('')
    }
  }

  return (
    <div className="board">
      <div className="board-lists">
        {board.lists
          .filter((list) => !list.done)
          .map((list) => (
            <List key={list.id} list={list} />
          ))}
        {board.lists
          .filter((list) => list.done)
          .map((list) => (
            <List key={list.id} list={list} />
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
                style={{ marginBottom: 8 }}
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
