import React, { useState, useRef } from 'react'
import './BoardListMenu.scss'

interface BoardListMenuProps {
  onEdit: () => void
  onDelete: () => void
  boardId: string
}

const BoardListMenu: React.FC<BoardListMenuProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const boardMenuRef = useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent): void => {
      // const menu = document.querySelector('.board-list-menu')
      const menu = boardMenuRef.current
      if (menu && !menu.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="board-list-menu" ref={boardMenuRef}>
      <span className="menu-icon" onClick={() => setOpen(!open)}>
        &#8942;
      </span>
      {open && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={onEdit}>
            编辑
          </div>
          <div className="menu-item" onClick={onDelete}>
            删除
          </div>
        </div>
      )}
    </div>
  )
}

export default BoardListMenu
