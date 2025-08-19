import { log } from 'console'
import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

export default (): void => {
  ipcMain.handle('getBoardsData', () => {
    const res = fs.promises.readFile(path.join('./build/board-data.json'), 'utf-8')
    return res
  })
  ipcMain.handle('setBoardsData', (_, data) => {
    log('Setting boards data:', data)
    fs.promises.writeFile(path.join('./build/board-data.json'), data)
  })
}
