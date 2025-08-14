import React, { useState } from 'react'
import './BoardList.scss'
import { BoardType } from '../../types'
import BoardListMenu from './BoardListMenu'

interface BoardListProps {
  boards: BoardType[]
  onSelect: (id: string) => void
  selectedId: string
}

const BoardList: React.FC<BoardListProps> = ({ boards, onSelect, selectedId }) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  // 仅演示，实际应由父组件管理boards
  const handleAddBoard = () => {
    if (newName.trim()) {
      // 这里应调用父组件方法
      setAdding(false)
      setNewName('')
    }
  }

  const handleEditBoard = (id: string, name: string) => {
    setEditId(id)
    setEditName(name)
  }

  const handleEditConfirm = () => {
    // 这里应调用父组件方法
    setEditId(null)
    setEditName('')
  }

  const handleDeleteBoard = (id: string) => {
    if (window.confirm('确定要删除该看板吗？')) {
      // 这里应调用父组件方法
    }
  }

  React.useEffect(() => {
    if (!adding) return
    const handleClick = (e: MouseEvent) => {
      const form = document.querySelector('.add-board-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewName('')
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAdding(false)
        setNewName('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [adding])

  return (
    <div className="board-list">
      {boards.map((board) => (
        <div
          key={board.id}
          className={`board-list-item${selectedId === board.id ? ' selected' : ''}`}
          onClick={() => onSelect(board.id)}
        >
          {editId === board.id ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <button onClick={handleEditConfirm}>确认</button>
            </div>
          ) : (
            <>
              {board.name || board.id}
              <BoardListMenu
                onEdit={() => handleEditBoard(board.id, board.name || board.id)}
                onDelete={() => handleDeleteBoard(board.id)}
              />
            </>
          )}
        </div>
      ))}
      {/* 添加看板选项 */}
      <div className="board-list-item add-board" onClick={() => setAdding(true)}>
        + 添加看板
      </div>
      {adding && (
        <div className="add-board-form">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="请输入看板名称"
            style={{ marginBottom: 8 }}
            autoFocus
          />
          <button onClick={handleAddBoard}>确认</button>
        </div>
      )}
    </div>
  )
}

export default BoardList
