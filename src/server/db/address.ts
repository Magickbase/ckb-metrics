import { db, Tables } from '@/server/db'

export const EXPIRE_MILLISECONDS = 10 * 60 * 1000

export interface Address {
  address: string
  isCorrect: boolean
  expireTime: number
}

export const get = async (address: string) => {
  return db
    .from(Tables.ValidatedAddress)
    .select()
    .eq('address', address)
    .then((res) => res.data)
}

export const batchGet = async (addresses: string[]) => {
  return db
    .from(Tables.ValidatedAddress)
    .select()
    .in('address', addresses)
    .then((res) => res.data)
}

export const batchAdd = async (addresses: Omit<Address, 'expireTime'>[]) => {
  await clear()
  const expireTime = Date.now() + EXPIRE_MILLISECONDS
  const res = await db
    .from(Tables.ValidatedAddress)
    .upsert(
      addresses.map((address) => ({
        address: address.address,
        is_correct: address.isCorrect,
        expire_time: new Date(expireTime).toISOString(),
      })),
    )
    .select()
  console.log(res)
  return res
}

export const clear = async () => {
  return db.from(Tables.ValidatedAddress).delete().lt('expire_time', new Date().toISOString())
}
