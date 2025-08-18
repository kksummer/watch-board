import React, { useState } from 'react'
import './CardMenu.scss'

interface CardMenuProps {
  onEdit: () => void
  onDelete: () => void
}

const CardMenu: React.FC<CardMenuProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const menu = document.querySelector('.card-menu')
      if (menu && !menu.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="card-menu">
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
          <div className="menu-item" onClick={onDelete}>
            删除
          </div>
        </div>
      )}
    </div>
  )
}

export default CardMenu
