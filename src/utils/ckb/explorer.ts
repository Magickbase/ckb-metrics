import { env } from '@/env'

const GENERAL_HEADERS = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

export const getBalancByAddress = async (
  address: string,
): Promise<{
  capacity: bigint
} | null> => {
  if (!address) return null
  const endpoint = `${env.CKB_EXPLORER_URL}api/v1/addresses/${address}`
  const res = await fetch(endpoint, { headers: GENERAL_HEADERS })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return null
    })
  return {
    capacity: BigInt(res?.data[0]?.attributes.balance ?? 0),
  }
}

export const getTipBlockNumber = async (): Promise<number | null> => {
  try {
    const res = await fetch(`${env.CKB_EXPLORER_URL}api/v1/statistics/tip_block_number`, {
      headers: GENERAL_HEADERS,
    }).then((r) => r.json())
    return res.data.attributes.tip_block_number ?? null
  } catch {
    return null
  }
}

export default {
  getBalancByAddress,
}
