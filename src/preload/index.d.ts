import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getBoardsData: () => Promise<string>
      setBoardsData: (data: string) => Promise<void>
    }
    // getBoardsData: () => JSONstring
    // setBoardsData: (data: JSONstring) => Promise<void>
  }
}
