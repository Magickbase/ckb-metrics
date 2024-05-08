// import { getBlockByHash, getCapacitiesByAddresses } from '@/utils/ckb/rpc'
import { helpers } from '@ckb-lumos/lumos'
import explorerApi from '@/utils/ckb/explorer'
import nodeApi from '@/utils/ckb/rpc'
import { log } from '@/utils/notifier/log'

const TOLERANCE = 100_000_000n

interface Address {
  capacity: bigint
  error?: string
}

// TODO validate inputs
export const validateAddressesInBlock = async (hash: string) => {
  console.info(`Validating block ${hash}`)
  const block = await nodeApi.getBlockByHash(hash)
  const outputCells = block.transactions.flatMap((tx) => tx.outputs)
  const addresses = new Map<string, Address>()

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

  for (const [addr, { error }] of addresses.entries()) {
    if (!error) continue
    log(addr, error)
  }

  const res = Object.fromEntries(addresses)
  return res
}
