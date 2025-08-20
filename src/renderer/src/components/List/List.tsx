import React, { useState } from 'react'
import './List.scss'
import Card from '../Card/Card'
// 新增 AddCard 组件
const AddCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="card add-card" onClick={onClick}>
    <span className="card-desc add-card-desc">+ 添加卡片</span>
  </div>
)
import { BoardType, ListType } from '../../types'
import ListMenu from './ListMenu'

interface ListProps {
  list: ListType
  boards: BoardType[]
  boardId: string
  updateBoards: (newBoards: BoardType[]) => Promise<void>
}

const List: React.FC<ListProps> = ({ list, boards, boardId, updateBoards }) => {
  const [cards, setCards] = useState(list.cards)
  const [adding, setAdding] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.title)

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
      updateBoards(
        boards.map((b) =>
          b.id === boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === list.id
                    ? {
                        ...l,
                        cards: [
                          ...cards,
                          {
                            id: `card-${Date.now()}`,
                            desc: newDesc,
                            time_stamp: Date.now().toString(),
                            done: false
                          }
                        ]
                      }
                    : l
                )
              }
            : b
        )
      )
      setAdding(false)
      setNewDesc('')
    }
  }
  // 删除卡片
  const handleDeleteCard = async (id: string): Promise<boolean> => {
    if (window.confirm('确定要删除该卡片吗？')) {
      console.log(`删除卡片: ${id}`)
      setCards(cards.filter((c) => c.id !== id))
      updateBoards(
        boards.map((b) =>
          b.id === boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === list.id ? { ...l, cards: l.cards.filter((c) => c.id !== id) } : l
                )
              }
            : b
        )
      )
    }
    return true
  }
  const handleEditTitle = (): void => {
    setEditingTitle(true)
  }

  const handleDeleteList = (): void => {
    if (window.confirm('确定要删除该列表吗？')) {
      // console.log(boards)
      // console.log('boardId:', boardId)
      // console.log(`listId: ${list.id}`)
      const newLists =
        boards.find((b) => b.id === boardId)?.lists.filter((l) => l.id !== list.id) || []
      const newBoard = boards.map((b) => (b.id === boardId ? { ...b, lists: newLists } : b))
      // console.log(newBoard)
      updateBoards(newBoard)
    }
  }
  // 切换卡片的完成状态
  const handleToggleDone = (id: string): void => {
    // console.log(id)
    setCards(cards.map((card) => (card.id === id ? { ...card, done: !card.done } : card)))
  }

  return (
    <div className={`list list-${list.id}`}>
      <div className="list-title-area">
        {editingTitle ? (
          <div className="edit-list-title-form">
            <input
              value={title}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingTitle(false)
              }}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
        ) : (
          <>
            <span className="list-title">{title}</span>
            <ListMenu
              listId={list.id}
              onEdit={handleEditTitle}
              onDelete={() => handleDeleteList()}
            />
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
              onDelete={() => {
                handleDeleteCard(card.id)
              }}
            />
          ))}
        {!adding && <AddCard onClick={() => setAdding(true)} />}
      </div>
      {adding && (
        <div className="add-card-form">
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="请输入卡片内容"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCard()
            }}
          />
        </div>
      )}
    </div>
  )
}

export default List
