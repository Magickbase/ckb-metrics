import { RPC, helpers } from '@ckb-lumos/lumos'
import { env } from '@/env'

const rpc = new RPC(env.CKB_RPC_URL)

export const getBlockByHash = async (hash: string) => {
  const res = await rpc.getBlock(hash)
  return res
}

namespace RawResponse {
  export interface Input {
    previous_output: Record<'index' | 'tx_hash', string>
    since: string
  }
  export interface Script {
    code_hash: string
    hash_type: string
    args: string
  }
  export interface Output {
    capacity: string
    lock: Script
    type?: Script
  }
  export interface Transaction {
    inputs: Input[]
    outputs: Output[]
  }
  export interface Block {
    header: {
      hash: string
    }
    transactions: Transaction[]
  }
}

export const getBlocks = async (tip: number, count = 10) => {
  const blockNumbers = Array.from({ length: count }, (_, i) => tip - i)
  const body = blockNumbers.map((bn, idx) => ({
    id: idx,
    jsonrpc: '2.0',
    method: 'get_block_by_number',
    params: [`0x${bn.toString(16)}`],
  }))

  const res: RawResponse.Block[] = await fetch(env.CKB_RPC_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((list) => list.map((i: { result: RawResponse.Block }) => i.result))
    .then((list) => list.filter((i: RawResponse.Block | undefined) => i))
    .catch((e) => {
      console.error(e)
      return []
    })
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
    .then((list) =>
      list.map((x: { result?: { capacity: string } }) => (x.result?.capacity ? BigInt(x.result.capacity) : 0n)),
    )

  return res.map((capacity, idx) => ({
    capacity,
    address: addresses[idx]!,
  }))
}

export const getTipHeader = async () => {
  const res = await rpc.getTipHeader()
  return res
}

export default {
  getBlocks,
  getBlockByHash,
  getCapacitiesByAddresses,
  getTipHeader,
}
