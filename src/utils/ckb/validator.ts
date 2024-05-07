// import { getBlockByHash, getCapacitiesByAddresses } from '@/utils/ckb/rpc'
import { helpers } from '@ckb-lumos/lumos'
import explorerApi from '@/utils/ckb/explorer'
import nodeApi from '@/utils/ckb/rpc'

const TOLERANCE = 100_000_000n

// TODO validate inputs
export const validateBalanceByBlock = async (hash: string) => {
  const block = await nodeApi.getBlockByHash(hash)
  const outputCells = block.transactions.flatMap((tx) => tx.outputs)
  const addresses = new Map<
    string,
    {
      capacity: bigint
      error?: string
    }
  >()

  outputCells.forEach((c) => {
    const addr = helpers.encodeToAddress(c.lock)
    addresses.set(addr, {
      capacity: 0n,
    })
  })

  const capacities = await nodeApi.getCapacitiesByAddresses([...addresses.keys()])

  capacities.forEach(({ address, capacity }) => {
    addresses.set(address, { capacity })
  })

  for (const addr of addresses.keys()) {
    const c = await explorerApi.getBalancByAddress(addr)
    const d = addresses.get(addr)
    if (!c || !d) continue
    const diff = d.capacity - c.capacity
    if (diff > TOLERANCE || diff < -1n * TOLERANCE) {
      d.error = `Expected ${d.capacity} but got ${c.capacity} from explorer, diff by ${diff}`
    }
  }
  const res = Object.fromEntries(addresses)
  return res
}
