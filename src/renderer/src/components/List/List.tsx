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
    const handleClick = (e: MouseEvent): void => {
      const form = document.querySelector('.add-card-form')
      if (form && !form.contains(e.target as Node)) {
        setAdding(false)
        setNewDesc('')
      }
    }
    const handleEsc = (e: KeyboardEvent): void => {
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
    const handleClick = (e: MouseEvent): void => {
      const form = document.querySelector('.edit-list-title-form')
      if (form && !form.contains(e.target as Node)) {
        setEditingTitle(false)
      }
    }
    const handleEsc = (e: KeyboardEvent): void => {
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

  const handleAddCard = (): void => {
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

  const handleEditTitle = (): void => {
    setEditingTitle(true)
  }

  const handleDeleteList = (): void => {
    if (window.confirm('确定要删除该列表吗？')) {
      // 实际应调用父组件方法
    }
  }
  // 切换卡片的完成状态
  const handleToggleDone = (id: string): void => {
    // console.log(id)
    setCards(cards.map((card) => (card.id === id ? { ...card, done: !card.done } : card)))
  }

  // 删除卡片
  const handleDeleteCard = async (id: string): Promise<boolean> => {
    if (window.confirm('确定要删除该卡片吗？')) {
      // 1. 获取整个 board 数据
      const res = await window.api.getBoards()
      const res_json = JSON.parse(res)
      const boards = res_json.boards
      console.log(boards)
      // 2. 找到当前 list，删除卡片
      const newBoard = {
        ...boards[0],
        lists: boards[0].lists.map((l: ListType) =>
          l.id === list.id ? { ...l, cards: l.cards.filter((c) => c.id !== id) } : l
        )
      }
      console.log(newBoard)
      // 3. 更新 board 数据
      await window.api.setBoards(newBoard)
      // 4. 更新本地 cards 状态
      setCards(cards.filter((c) => c.id !== id))
    }
    return true
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
            <Card
              key={card.id}
              card={card}
              onToggleDone={() => handleToggleDone(card.id)}
              onDelete={() => handleDeleteCard(card.id)}
            />
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
