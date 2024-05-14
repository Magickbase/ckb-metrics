import { inArray, sql, lt, eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { validatedAddressesTable } from '@/server/db/schema'

export const EXPIRE_MILLISECONDS = 10 * 60 * 1000

export interface Address {
  address: string
  isCorrect: boolean
  expireTime: number
}

export const batchGet = async (addresses: string[]) => {
  if (!addresses.length) return []
  return db
    .select({
      address: validatedAddressesTable.address,
      expireTime: validatedAddressesTable.expireTime,
      isCorrect: validatedAddressesTable.isCorrect,
    })
    .from(validatedAddressesTable)
    .where(inArray(validatedAddressesTable.address, addresses))
}

export const batchUpdate = async (addresses: Omit<Address, 'expireTime'>[]) => {
  await clear()
  if (!addresses.length) return

  const expireTime = new Date(Date.now() + EXPIRE_MILLISECONDS)

  await db
    .insert(validatedAddressesTable)
    .values(addresses.map((address) => ({ ...address, expireTime })))
    .onConflictDoUpdate({
      target: validatedAddressesTable.address,
      set: {
        isCorrect: sql`excluded.is_correct`,
        error: sql`excluded.error`,
        expireTime,
      },
    })
}

export const clear = async () => {
  return db.delete(validatedAddressesTable).where(lt(validatedAddressesTable.expireTime, new Date()))
}

export const getIncorrectAddresses = async () => {
  return db
    .select({
      address: validatedAddressesTable.address,
      error: validatedAddressesTable.error,
    })
    .from(validatedAddressesTable)
    .where(eq(validatedAddressesTable.isCorrect, false))
}
