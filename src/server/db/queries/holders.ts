import { inArray } from 'drizzle-orm'
import { db } from '@/server/db'
import { holdersTable } from '@/server/db/schema'
import { getHolderAllocation } from '@/utils/ckb/getHolderAllocation'

interface Holder {
  typeHash: string
  codeHash: string
  hashType: string
  args: string
  holders: Record<string, number>
}

export const batchGet = async (typeHashes: string[]) => {
  const res = new Map<string, unknown>()
  if (!typeHashes.length) return res

  const r = await db
    .select({
      typeHash: holdersTable.typeHash,
      holders: holdersTable.holders,
    })
    .from(holdersTable)
    .where(inArray(holdersTable.typeHash, typeHashes))

  r.forEach((i) => {
    res.set(i.typeHash, i.holders)
  })

  return res
}

export const update = async (holders: Holder) => {
  await db
    .insert(holdersTable)
    .values([holders])
    .onConflictDoUpdate({
      target: holdersTable.typeHash,
      set: {
        holders: holders.holders,
      },
    })
}

export const syncAll = async () => {
  const list = await db
    .select({
      typeHash: holdersTable.typeHash,
      codeHash: holdersTable.codeHash,
      hashType: holdersTable.hashType,
      args: holdersTable.args,
    })
    .from(holdersTable)
  for (const i of list) {
    const allocation = await getHolderAllocation({ codeHash: i.codeHash, hashType: i.hashType as any, args: i.args })
    await update({
      typeHash: i.typeHash,
      codeHash: i.codeHash,
      hashType: i.hashType,
      args: i.args,
      holders: Object.fromEntries(allocation),
    })
  }
}
