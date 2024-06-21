import { scheduler } from 'node:timers/promises'
import { env } from '@/env'

type Script = Record<'code_hash' | 'hash_type' | 'args', string>
type ScriptType = 'lock' | 'type'

export interface Cell {
  block_number: string
  out_point: {
    index: string
    tx_hash: string
  }
  output: { capacity: string; lock: Script; type?: Script }
  output_data: string
  tx_index: string
}

const getCellGroup = (script: Script, script_type: ScriptType, cursor?: string) =>
  fetch(env.CKB_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'get_cells',
      params: [{ script, script_type }, 'asc', `0x${(50000).toString(16)}`, cursor ?? null],
    }),
  })
    .then((res) => res.json())
    .then((res) => res.result)

const aggregate = async (script: Script, scriptType: ScriptType, cursor?: string) => {
  const res = await getCellGroup(script, scriptType, cursor)

  return { cells: res.objects ?? [], cursor: res.last_cursor }
}

export const getCells = async (script: Script, scriptType: ScriptType = 'type') => {
  let cursor
  const cells: Array<Cell> = []

  const res = await aggregate(script, scriptType)
  cursor = res.cursor
  cells.push(...res.cells)

  while (cursor) {
    await scheduler.wait(0)
    const res = await aggregate(script, scriptType, cursor)
    cells.push(...res.cells)
    if (cursor !== '0x') {
      cursor = res.cursor
    } else {
      break
    }
  }
  return cells
}
