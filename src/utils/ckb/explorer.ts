import { env } from '@/env'

export const getBalancByAddress = async (
  address: string,
): Promise<{
  capacity: bigint
} | null> => {
  if (!address) return null
  const endpoint = `${env.CKB_EXPLORER_URL}api/v1/addresses/${address}`
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return null
    })
  return {
    capacity: BigInt(res?.data[0]?.attributes.balance ?? 0),
  }
}

export default {
  getBalancByAddress,
}
