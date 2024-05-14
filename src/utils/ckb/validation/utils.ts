import { type RawResponse } from '@/utils/ckb/rpc'
import { type HashType } from '@ckb-lumos/lumos'
import { SCRIPTS } from '@/utils/constant'
import { computeScriptHash } from '@ckb-lumos/lumos/utils'
import { bytes, number } from '@ckb-lumos/codec'
// import { bytes } from '@ckb-lumos/lumos/codec'

const xudtScript = SCRIPTS.xudt

const isXudtCell = (cell: RawResponse.Cell) => {
  if (!xudtScript) return false
  return cell.output.type?.code_hash === xudtScript.codeHash && cell.output.type?.hash_type === xudtScript.hashType
}

export const getXudtsFromCells = (cells: Array<RawResponse.Cell>) => {
  const xudtCells = cells.filter(isXudtCell)
  const xudtMapp = new Map<string /* type hash */, bigint /* amount */>()
  xudtCells.forEach((c) => {
    if (!c.output.type) return
    const typeHash = computeScriptHash({
      codeHash: c.output.type.code_hash,
      hashType: c.output.type.hash_type as HashType,
      args: c.output.type.args,
    })
    try {
      const amount = bytes.hexify(`0x${number.Uint16LE.unpack(c.output_data.slice(0, 34))}`)
      xudtMapp.set(typeHash, BigInt(amount))
    } catch {
      // ignore
    }
  })
  return xudtMapp
}
