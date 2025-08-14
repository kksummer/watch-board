import React, { useEffect, useState } from 'react'
import Banner from './components/Banner/Banner'
import BoardList from './components/BoardList/BoardList'
import Board from './components/Board/Board'
import './App.scss'
import { BoardType } from './types'
import { json } from 'stream/consumers'

function App(): React.JSX.Element {
  const [boards, setBoards] = useState<BoardType[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const selectedBoard = boards.find((b) => b.id === selectedId)
  const fetchBoards = async () => {
    try {
      const res = await window.api.getBoards()
      const res_json = JSON.parse(res)
      console.log(Array.isArray(res_json.boards))

      if (Array.isArray(res_json.boards)) {
        setBoards(res_json.boards)
        if (res_json.length > 0) setSelectedId(res_json[0].id)
      }
    } catch (err) {
      console.error('Error fetching boards:', err)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div className="app-container">
      <Banner />
      <div className="main-content">
        <div className="sidebar">
          <BoardList boards={boards} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="board-area">{selectedBoard && <Board board={selectedBoard} />}</div>
      </div>
    </div>
  )
}

export default App
