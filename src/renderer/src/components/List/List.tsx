import React, { useState } from 'react'
import './List.scss'
import Card from '../Card/Card'
import { ListType } from '../../types'
import ListMenu from './ListMenu'

interface ListProps {
  list: ListType
}

const List: React.FC<ListProps> = ({ list }) => {
  const [cards, setCards] = useState(list.cards)
  const [adding, setAdding] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.id)

  React.useEffect(() => {
    if (!adding) return
    const handleClick = (e: MouseEvent) => {
      const form = document.querySelector('.add-card-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewDesc('')
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAdding(false)
        setNewDesc('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [adding])

  React.useEffect(() => {
    if (!editingTitle) return
    const handleClick = (e: MouseEvent) => {
      const form = document.querySelector('.edit-list-title-form')
      if (form && !form.contains(e.target as Node)) {
        setEditingTitle(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingTitle(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [editingTitle])

  const handleAddCard = () => {
    if (newDesc.trim()) {
      setCards([
        ...cards,
        {
          id: `card-${Date.now()}`,
          desc: newDesc,
          time_stamp: Date.now().toString(),
          done: false
        }
      ])
      setAdding(false)
      setNewDesc('')
    }
  }

  const handleEditTitle = () => {
    setEditingTitle(true)
  }

  const handleDeleteList = () => {
    if (window.confirm('确定要删除该列表吗？')) {
      // 实际应调用父组件方法
    }
  }
  // 切换卡片的完成状态
  const handleToggleDone = (id) => {
    // console.log(id)
    setCards(cards.map((card) => (card.id === id ? { ...card, done: !card.done } : card)))
  }

  return (
    <div className={`list list-${list.id}`}>
      <div className="list-title-area">
        {editingTitle ? (
          <div className="edit-list-title-form">
            <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <button onClick={() => setEditingTitle(false)}>确认</button>
          </div>
        ) : (
          <>
            <span className="list-title">{title}</span>
            <ListMenu onEdit={handleEditTitle} onDelete={handleDeleteList} />
          </>
        )}
      </div>
      <div className="list-cards card-animate">
        {[...cards]
          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
          .map((card) => (
            <Card key={card.id} card={card} onToggleDone={() => handleToggleDone(card.id)} />
          ))}
      </div>
      <div className="add-card-li" onClick={() => setAdding(true)}>
        + 添加卡片
      </div>
      {adding && (
        <div className="add-card-form">
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="请输入卡片内容"
            autoFocus
            style={{ marginBottom: 8 }}
          />
          <button onClick={handleAddCard}>添加卡片</button>
        </div>
      )}
    </div>
  )
}

export default List
