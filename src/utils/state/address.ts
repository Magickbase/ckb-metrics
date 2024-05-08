const EXPIRE_MILLISECONDS = 10 * 60 * 1000

export const validatedAddresses = {
  map: new Map<string, number>(),
  add(addresses: string[]) {
    this.clear()
    const expireTime = Date.now() + EXPIRE_MILLISECONDS
    addresses.forEach((addr) => {
      this.map.set(addr, expireTime)
    })
  },
  isExpired(addr: string) {
    const now = Date.now()
    const expireTime = this.map.get(addr)
    if (!expireTime) return true
    return now >= expireTime
  },
  clear() {
    const now = Date.now()
    for (const [addr, expireTime] of this.map.entries()) {
      if (now > expireTime) {
        this.map.delete(addr)
      }
    }
  },
}
