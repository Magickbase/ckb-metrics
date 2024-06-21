import { Script } from '@ckb-lumos/lumos'
import { type Cell, getCells } from './getCells'

const getHolderAllocationFromCells = (cells: Cell[]) => {
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
  const cells = await getCells({
    code_hash: typeScript.codeHash,
    hash_type: typeScript.hashType,
    args: typeScript.args,
  })
  return getHolderAllocationFromCells(cells)
}
