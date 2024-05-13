import { env } from '@/env'
import { addressQueries } from '@/utils/state'

const GENERAL_HEADERS = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

export const getAddressAttribute = async (
  address: string,
): Promise<{
  xudts: Map<string, bigint>
  capacity: bigint
  cellCount: number
} | null> => {
  if (!address) return null
  const endpoint = `${env.CKB_EXPLORER_URL}api/v1/addresses/${address}`
  const cache = addressQueries.get(address)

  let res = cache?.res
  if (!res) {
    res = await fetch(endpoint, { headers: GENERAL_HEADERS })
      .then((res) => res.json())
      .then((r) => r.data[0]?.attribtues ?? null)
      .catch((e) => {
        console.error(e)
        return null
      })
    if (res) {
      addressQueries.add(address, res)
    }
  }
  const xudts = res?.udt_accounts?.filter((i) => i.udt_type === 'xudt') ?? []
  return {
    capacity: BigInt(res?.balance ?? 0),
    cellCount: +(res?.live_cells_count ?? 0),
    xudts: xudts.reduce((acc, cur) => {
      acc.set(cur.type_hash, BigInt(cur.amount))
      return acc
    }, new Map<string, bigint>()),
  }
}

export const getTipBlockNumber = async (): Promise<number | null> => {
  try {
    const res = await fetch(`${env.CKB_EXPLORER_URL}api/v1/statistics/tip_block_number`, {
      headers: GENERAL_HEADERS,
    }).then((r) => r.json())
    return res.data.attributes.tip_block_number ?? null
  } catch (e) {
    console.error(e)
    return null
  }
}

export default {
  getAddressAttribute,
}
