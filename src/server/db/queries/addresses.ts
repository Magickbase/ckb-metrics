import { db, get, set } from '@/server/db'

export const EXPIRE_MILLISECONDS = 10 * 60 * 1000
const ADDRESSES_KEY_PREFIX = 'validated_addresses:'

export interface Address {
  address: string
  isCorrect: boolean
  expireTime: number
  error?: string
}

export const batchGet = async (addresses: string[]) => {
  if (!addresses.length) return []
  const results: Address[] = []

  await Promise.all(
    addresses.map(async (address) => {
      const data = await get(ADDRESSES_KEY_PREFIX + address)
      if (data) {
        results.push(data as Address)
      }
    }),
  )

  return results
}

export const batchUpdate = async (addresses: Omit<Address, 'expireTime'>[]) => {
  if (!addresses.length) return

  const expireTime = Date.now() + EXPIRE_MILLISECONDS

  await Promise.all(
    addresses.map(async (address) => {
      await set(ADDRESSES_KEY_PREFIX + address.address, { ...address, expireTime }, EXPIRE_MILLISECONDS / 1000)
    }),
  )
}

export const getIncorrectAddresses = async () => {
  const keys = await db.keys(ADDRESSES_KEY_PREFIX + '*')
  const results: { address: string; error: string }[] = []

  await Promise.all(
    keys.map(async (key) => {
      const data = (await get(key)) as Address | null
      if (data && !data.isCorrect && data.error) {
        results.push({
          address: data.address,
          error: data.error,
        })
      }
    }),
  )

  return results
}
