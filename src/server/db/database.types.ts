export interface Database {
  public: {
    Tables: {
      validated_addresses: {
        Row: {
          id: number
          address: string
          expire_time: number
          is_correct: boolean
        }
        Insert: {
          id?: never
          address: string
          expire_time: number
          is_correct: boolean
        }
        Delete: {
          id: number
        }
      }
      tg_chats: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        delete: {
          id: number
        }
      }
    }
  }
}

export enum Tables {
  ValidatedAddress = 'validated_addresses',
  TgChats = 'tg_chats',
}
