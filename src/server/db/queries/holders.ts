import { db, get, set } from '@/server/db'
import { getHolderAllocation } from '@/utils/ckb/getHolderAllocation'

interface Holder {
  typeHash: string
  codeHash: string
  hashType: string
  args: string
  holders: Record<string, number>
}

const HOLDERS_KEY_PREFIX = 'holders:'

export const batchGet = async (typeHashes: string[]) => {
  const res = new Map<string, unknown>()
  if (!typeHashes.length) return res

  await Promise.all(
    typeHashes.map(async (typeHash) => {
      const holders = await get(HOLDERS_KEY_PREFIX + typeHash)
      if (holders) {
        res.set(typeHash, holders)
      }
    }),
  )

  return res
}

export const update = async (holders: Holder) => {
  await set(HOLDERS_KEY_PREFIX + holders.typeHash, holders)
}

export const syncAll = async () => {
  const keys = await db.keys(HOLDERS_KEY_PREFIX + '*')
  for (const key of keys) {
    const holder = await get(key)
    if (!holder) continue

    const allocation = await getHolderAllocation({
      codeHash: holder.codeHash,
      hashType: holder.hashType as any,
      args: holder.args,
    })

    await update({
      typeHash: holder.typeHash,
      codeHash: holder.codeHash,
      hashType: holder.hashType,
      args: holder.args,
      holders: Object.fromEntries(allocation),
    })
  }
}
