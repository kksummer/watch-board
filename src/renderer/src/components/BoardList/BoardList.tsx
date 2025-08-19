import React, { useState } from 'react'
import './BoardList.scss'
import { BoardType } from '../../types'
import BoardListMenu from './BoardListMenu'

interface BoardListProps {
  boards: BoardType[]
  onSelect: (id: string) => void
  selectedId: string
  updateBoards: (newBoards: BoardType[]) => Promise<void>
}

const BoardList: React.FC<BoardListProps> = ({ boards, onSelect, selectedId, updateBoards }) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  // 仅演示，实际应由父组件管理boards
  const handleAddBoard = async (): Promise<void> => {
    if (newName.trim()) {
      // 这里应调用父组件方法
      setAdding(false)
      setNewName('')
      const newBoard: BoardType = {
        id: Date.now().toString(),
        name: newName,
        time_stamp: Date.now().toString(),
        done: false,
        lists: []
      }
      // 构造新的 boards 数组
      const newBoards = [...boards, newBoard]
      console.log('更新后的 boards:', newBoards)
      onSelect(newBoard.id)
      // 调用父组件方法更新 boards
      await updateBoards(newBoards)
    }
  }

  const handleEditBoard = (id: string, name: string): void => {
    setEditId(id)
    setEditName(name)
  }

  const handleEditConfirm = (): void => {
    // 这里应调用父组件方法
    setEditId(null)
    setEditName('')
  }

  const handleDeleteBoard = async (id: string): Promise<boolean> => {
    console.log(`删除看板: ${id}`)
    if (window.confirm('确定要删除该看板吗？')) {
      // 这里应调用父组件方法
      // console.log(`删除看板: ${id}`)
      const newBoards = boards.filter((board) => board.id !== id)
      await updateBoards(newBoards)
    }
    return true
  }

  React.useEffect(() => {
    if (!adding) return
    const handleClick = (e: MouseEvent): void => {
      const form = document.querySelector('.add-board-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewName('')
      }
    }
    const handleEsc = (e: KeyboardEvent): void => {
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
