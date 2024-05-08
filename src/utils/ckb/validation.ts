import { type HashType, helpers } from '@ckb-lumos/lumos'
import explorerApi from '@/utils/ckb/explorer'
import nodeApi from '@/utils/ckb/rpc'
import { log } from '@/utils/notifier/log'

const TOLERANCE = 100n // 1%

interface Address {
  capacity: bigint
  error?: string
}

// TODO validate inputs
export const validateAddressesInBlock = async (hash: string) => {
  console.info(`Validating block ${hash}`)
  const block = await nodeApi.getBlockByHash(hash)
  const outputCells = block.transactions.flatMap((tx) => tx.outputs)
  const addresses = outputCells.map((oc) => helpers.encodeToAddress(oc.lock))
  const result = await validateAddresses(addresses)
  return Object.fromEntries(result)
}

export const validateAddressesInBlocks = async (tip: number) => {
  const blocks = await nodeApi.getBlocks(tip)
  console.info(`Validating block ${blocks.map((b) => b.header.hash)}`)
  const outputCells = blocks.flatMap((block) => block.transactions.flatMap((tx) => tx.outputs))
  const addresses = outputCells.map((oc) =>
    helpers.encodeToAddress({
      codeHash: oc.lock.code_hash,
      hashType: oc.lock.hash_type as HashType,
      args: oc.lock.args,
    }),
  )
  const result = await validateAddresses(addresses)
  return Object.fromEntries(result)
}

export const validateAddresses = async (addrList: string[]) => {
  const addresses = new Map<string, Address>(addrList.map((addr) => [addr, { capacity: 0n }]))

  const capacities = await nodeApi.getCapacitiesByAddresses([...addresses.keys()])

  capacities.forEach(({ address, capacity }) => {
    addresses.set(address, { capacity })
  })

  for (const addr of addresses.keys()) {
    const e = await explorerApi.getBalancByAddress(addr)
    const n = addresses.get(addr)
    if (!e || !n) continue
    let diff = n.capacity - e.capacity
    if (diff < 0) diff = -1n * diff

    if (diff > n.capacity / TOLERANCE) {
      n.error = `Expected ${n.capacity} but got ${e.capacity} from explorer, diff by ${diff}`
    }
  }

  for (const [addr, { error }] of addresses.entries()) {
    if (!error) continue
    log(addr, error)
  }

  return addresses
}
