import React, { useState, useRef } from 'react'
import './ListMenu.scss'

interface ListMenuProps {
  onEdit: () => void
  onDelete: (listId: string) => void
  listId: string
}

const ListMenu: React.FC<ListMenuProps> = ({ onEdit, onDelete, listId }) => {
  const [open, setOpen] = useState(false)
  const listMenuRef = useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent): void => {
      const menu = listMenuRef.current
      if (menu && !menu.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="list-menu" ref={listMenuRef}>
      <span className="menu-icon" onClick={() => setOpen(!open)}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </span>
      {open && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={onEdit}>
            编辑
          </div>
          <div className="menu-item" onClick={() => onDelete(listId)}>
            删除123
          </div>
        </div>
      )}
    </div>
  )
}

export default ListMenu
