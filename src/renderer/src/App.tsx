import React, { useEffect, useState } from 'react'
import Banner from './components/Banner/Banner'
import BoardList from './components/BoardList/BoardList'
import Board from './components/Board/Board'
import './App.scss'
import { BoardType } from './types'

function App(): React.JSX.Element {
  const [boards, setBoards] = useState<BoardType[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const selectedBoard = boards.find((b) => b.id === selectedId)
  const fetchBoards = async (): Promise<void> => {
    try {
      const res = await window.api.getBoardsData()
      const res_json = JSON.parse(res)
      // console.log(Array.isArray(res_json.boards))

      if (Array.isArray(res_json.boards)) {
        console.log('Fetched boards:', res_json.boards)
        setBoards(res_json.boards)
        if (res_json.boards.length > 0) setSelectedId(res_json.boards[0].id)
      }
    } catch (err) {
      console.error('Error fetching boards:', err)
    }
  }
  const updateBoards = async (newBoards: BoardType[]): Promise<void> => {
    try {
      await window.api.setBoardsData(JSON.stringify({ boards: newBoards }))
      setBoards(newBoards)
      if (newBoards.length > 0) setSelectedId(newBoards[0].id)
    } catch (err) {
      console.error('Error updating boards:', err)
    }
  }

  // 初始化
  useEffect(() => {
    fetchBoards()
  }, [])

  // useEffect(() => {
  //   if (boards.length > 0) {
  //     window.api.setBoardsData(JSON.stringify({ boards }))
  //   }
  // }, [boards])

  return (
    <div className="app-container">
      <Banner />
      <div className="main-content">
        <div className="sidebar">
          <BoardList
            boards={boards}
            selectedId={selectedId}
            onSelect={setSelectedId}
            updateBoards={updateBoards}
          />
        </div>
        <div className="board-area">
          {selectedBoard && (
            <Board
              board={selectedBoard}
              boards={boards}
              updateBoards={updateBoards}
              selectedId={selectedId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
