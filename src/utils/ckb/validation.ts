import { type HashType, helpers } from '@ckb-lumos/lumos'
import explorerApi from '@/utils/ckb/explorer'
import nodeApi from '@/utils/ckb/rpc'
import { validatedBlockHashes } from '@/utils/state'
import * as addressDb from '@/server/db/address'
import { log } from '@/utils/notifier/log'

const TOLERANCE = 100n // 1%

interface Address {
  capacity: bigint
  error?: string
}

const notify = (address: string, message: string) => {
  log(address, message)
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
  const blocksToValidate = blocks.filter((b) => !validatedBlockHashes.isValidated(b.header.hash))
  validatedBlockHashes.add(blocksToValidate.map((b) => b.header.hash))

  console.info(`Validating ${blocksToValidate.length} blocks\n${blocksToValidate.map((b) => b.header.hash).join('\n')}`)
  const outputCells = blocksToValidate.flatMap((block) => block.transactions.flatMap((tx) => tx.outputs))
  const addresses = [
    ...new Set(
      outputCells.map((oc) =>
        helpers.encodeToAddress({
          codeHash: oc.lock.code_hash,
          hashType: oc.lock.hash_type as HashType,
          args: oc.lock.args,
        }),
      ),
    ),
  ]
  const cachedAddresses = await addressDb.batchGet(addresses)
  const NOW = Date.now()
  const addressesToValidate = addresses.filter((addr) => {
    if (!cachedAddresses?.includes(addr)) {
      return true
    }
    const cachedAddr = cachedAddresses.find((a) => a === addr)
    if (!cachedAddr) return true
    if (new Date(cachedAddr.expire_time).getTime() < NOW) return true
  })
  console.info(`Validating ${addressesToValidate.length} addresses\n${addressesToValidate.map((a) => a).join('\n')}`)

  const result = await validateAddresses(addressesToValidate)

  for (const item of result.entries()) {
    if (item[1].error) {
      const addr = item[0]
      if (!cachedAddresses?.find((a) => a === addr)?.is_correct) {
        continue
      }
      notify(item[0], item[1].error)
    }
  }

  await addressDb.batchUpdate(
    [...result.entries()].map(([address, { error }]) => ({
      address,
      isCorrect: !!error,
    })),
  )
  return Object.fromEntries(result)
}

export const validateAddresses = async (addrList: string[]) => {
  const addresses = new Map<string, Address>(addrList.map((addr) => [addr, { capacity: 0n }]))

  if (!addrList.length) return addresses

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

  return addresses
}
