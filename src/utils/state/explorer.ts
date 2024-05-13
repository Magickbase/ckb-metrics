const EXPIRE_MILLISECONDS = 1000 * 8 // 8 seconds

interface AddressAttribute {
  balance: string
  udt_accounts: Record<'amount' | 'type_hash' | 'udt_type', string>[]
  live_cells_count: string
}

export const addressQueries = {
  map: new Map<string, { res: AddressAttribute; expireTime: Date }>(),
  get(address: string) {
    const NOW = new Date()
    const cached = this.map.get(address)
    if (!cached || cached.expireTime < NOW) {
      return null
    }
    return cached
  },
  add(address: string, res: AddressAttribute) {
    this.clear()
    const expireTime = new Date(Date.now() + EXPIRE_MILLISECONDS)
    this.map.set(address, { res, expireTime })
  },
  clear() {
    const NOW = new Date()
    this.map.forEach((v, k) => {
      if (v.expireTime < NOW) {
        this.map.delete(k)
      }
    })
  },
}
