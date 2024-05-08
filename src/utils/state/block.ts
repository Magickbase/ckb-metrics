export const validatedBlockHashes = {
  set: new Set<string>(),
  isValidated(hash: string) {
    return this.set.has(hash)
  },
  add(hashes: string[]) {
    this.clear()
    hashes.forEach((hash) => {
      this.set.add(hash)
    })
  },
  clear() {
    this.set.size > 100 ? this.set.clear() : null
  },
}
