import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { env } from '@/env'
import { type RawResponse } from '@/utils/ckb/rpc'

export const getCellsByAddresses = async (addresses: string[]) => {
  // only fetch first page for performance
  const LIMIT = 50000
  const body = addresses.map((addr, idx) => {
    const script = addressToScript(addr)
    return {
      id: idx,
      jsonrpc: '2.0',
      method: 'get_cells',
      params: [
        {
          script: {
            code_hash: script.codeHash,
            hash_type: script.hashType,
            args: script.args,
          },
          script_type: 'lock',
        },
        'asc',
        `0x${LIMIT.toString(16)}`,
      ],
    }
  })
  const res: Array<Array<RawResponse.Cell> | null> = await fetch(env.NEXT_PUBLIC_CKB_RPC_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .then((list) =>
      list.map((x: { result?: { objects: Array<RawResponse.Cell> } }) => {
        if (!x.result?.objects) return null
        if (x.result.objects.length === LIMIT) {
          // maybe more cells, skip
          return null
        }
        return x.result.objects
      }),
    )
    .catch((e) => {
      console.error(e)
    })

  const map = new Map<string, Array<RawResponse.Cell>>()

  res.forEach((cells, idx) => {
    const addr = addresses[idx]
    if (cells && addr) {
      map.set(addr, cells)
    }
  })

  return map
}
