import React, { useState, useEffect } from 'react'
import './Card.scss'
import { CardType } from '../../types'
import CardMenu from './CardMenu'

interface CardProps {
  card: CardType
  onToggleDone: () => void
  onDelete: () => void
}

const Card: React.FC<CardProps> = ({ card, onToggleDone, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(card.desc)

  useEffect(() => {
    if (!editing) return
    // 监听点击事件，点击其他地方时关闭编辑状态
    const handleClick = (e: MouseEvent): void => {
      const form = document.querySelector('.edit-card-form')
      if (form && !form.contains(e.target as Node)) {
        setEditing(false)
      }
    }
    // 监听键盘事件，按下Esc键时关闭编辑状态
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setEditing(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [editing])

  const handleEdit = (): void => setEditing(true)

  const handleConfirm = (): void => {
    setEditing(false)
    // 实际应调用父组件方法
  }

  return (
    <div className={`card${card.done ? ' done' : ''}`}>
      <span className="card-check" onClick={onToggleDone}>
        <span className={`circle${card.done ? ' checked' : ''}`}>{card.done ? '✔' : ''}</span>
      </span>
      {editing ? (
        <div className="edit-card-form">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: 'calc(100% - 80px)', marginRight: 8 }}
            autoFocus
          />
          <button style={{ width: 72 }} onClick={handleConfirm}>
            确认
          </button>
        </div>
      ) : (
        <>
          <span
            className="card-desc"
            style={{ textDecoration: card.done ? 'line-through' : 'none' }}
          >
            {desc}
          </span>
          <CardMenu onEdit={handleEdit} onDelete={onDelete} />
        </>
      )}
    </div>
  )
}

export default Card
