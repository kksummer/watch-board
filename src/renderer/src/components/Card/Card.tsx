import React, { useState, useEffect } from 'react'
import './Card.scss'
import { CardType } from '../../types'
import CardMenu from './CardMenu'

interface CardProps {
  card: CardType
  onToggleDone: () => void
}

const Card: React.FC<CardProps> = ({ card, onToggleDone }) => {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(card.desc)

  React.useEffect(() => {
    if (!editing) return
    const handleClick = (e: MouseEvent) => {
      const form = document.querySelector('.edit-card-form')
      if (form && !form.contains(e.target as Node)) {
        setEditing(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
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

  const handleEdit = () => setEditing(true)
  const handleDelete = () => {
    if (window.confirm('确定要删除该卡片吗？')) {
      // 实际应调用父组件方法
    }
  }
  const handleConfirm = () => {
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
          <CardMenu onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  )
}

export default Card
