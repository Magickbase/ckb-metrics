export const log = (address: string, message: string) => {
  console.error(`[LOG] ${address}: ${message}\nhttps://explorer.nervos.org/address/${address}`)
}
