export interface CardType {
  id: string
  desc: string
  time_stamp: string
  done: boolean // 表示卡片是否已完成
}

export interface ListType {
  id: string
  cards: CardType[]
  title: string
  time_stamp: string
  done: boolean // 可选属性，表示列表是否已完成
}

export interface BoardType {
  id: string
  name: string
  lists: ListType[]
}
