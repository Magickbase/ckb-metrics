import { Script } from '@ckb-lumos/lumos'
import { computeScriptHash } from '@ckb-lumos/lumos/utils'
import { env } from '@/env'
import { parse } from 'csv-parse/sync'
import { getTipBlockNumber } from './explorer'
import { type Cell } from './getCells'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'

export const getHolderAllocationFromCells = (cells: Cell[]) => {
  const allocation = new Map<string, number>()
  cells.forEach((cell) => {
    const key = cell.output.lock.code_hash
    if (allocation.has(key)) {
      allocation.set(key, (allocation.get(key) ?? 0) + 1)
    } else {
      allocation.set(key, 1)
    }
  })
  return allocation
}

export const getHolderAllocation = async (typeScript: Script) => {
  const allocation = new Map<string, number>()
  const typeHash = computeScriptHash(typeScript)
  const tipBlockNumber = await getTipBlockNumber()

  if (!tipBlockNumber) {
    return allocation
  }

  const csv = await fetch(
    `${env.CKB_EXPLORER_URL}/api/v1/xudts/snapshot?${new URLSearchParams({
      id: typeHash,
      number: (+tipBlockNumber).toString(),
    })}`,
    {
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
      },
      body: null,
      method: 'GET',
    },
  ).then((res) => res.text())
  const records = parse(csv)
  const holders: string[] = records
    .slice(1)
    .map(
      (r: [token: string, blockNumber: string, time: string, holder: string, ckbAddress: string, amount: string]) =>
        r[4],
    )
  holders.forEach((h) => {
    let key: string | null = null
    if (h.startsWith('ckb')) {
      // ckb holder
      try {
        const script = addressToScript(h)
        key = script.codeHash
      } catch {
        // invalid address
      }
    } else {
      key = 'btc'
    }
    if (!key) return
    if (allocation.has(key)) {
      const a = allocation.get(key) ?? 0
      allocation.set(key, a + 1)
    } else {
      allocation.set(key, 1)
    }
  })

  return allocation
}
