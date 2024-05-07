import { RPC, helpers } from '@ckb-lumos/lumos'
import { env } from '@/env'

const rpc = new RPC(env.CKB_RPC_URL)

export const getBlockByHash = async (hash: string) => {
  const res = await rpc.getBlock(hash)
  return res
}

export const getCapacitiesByAddresses = async (
  addresses: string[],
): Promise<
  {
    address: string
    capacity: bigint
  }[]
> => {
  const body = addresses.map((addr, idx) => {
    const script = helpers.addressToScript(addr)
    return {
      id: idx,
      jsonrpc: '2.0',
      method: 'get_cells_capacity',
      params: [
        {
          script: {
            code_hash: script.codeHash,
            hash_type: script.hashType,
            args: script.args,
          },
          script_type: 'lock',
        },
      ],
    }
  })

  const res: bigint[] = await fetch(env.CKB_RPC_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .then((r) => r.map((x: any) => (x.result?.capacity ? BigInt(x.result.capacity) : 0n)))

  return res.map((capacity, idx) => ({
    capacity,
    address: addresses[idx]!,
  }))
}

export default {
  getBlockByHash,
  getCapacitiesByAddresses,
}
