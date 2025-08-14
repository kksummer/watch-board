import { log } from 'console'
import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

export default (): void => {
  ipcMain.handle('getBoards', () => {
    const res = fs.readFileSync(path.join('./build/board-data.json'), 'utf-8')
    return res
  })
  ipcMain.handle('setBoards', (_, data) => {
    console.log('setBoards', data)

    // fs.writeFileSync(path.join('./build/board-data.json'), data)
  })
}
