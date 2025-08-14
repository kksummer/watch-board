export interface CardType {
  id: string
  desc: string
}

export interface ListType {
  id: string
  cards: CardType[]
}

export interface BoardType {
  id: string
  name: string
  lists: ListType[]
}
