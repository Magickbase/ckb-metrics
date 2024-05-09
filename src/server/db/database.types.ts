export interface Database {
  public: {
    Tables: {
      validated_addresses: {
        Row: {
          address: string
          expire_time: string
          is_correct: boolean
        }
        Insert: {
          address: string
          expire_time: string
          is_correct: boolean
        }
        Delete: {
          address: string
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
