import { type NextRequest } from 'next/server'
import { type Script } from '@ckb-lumos/lumos'
import { api } from '@/trpc/server'
import { computeScriptHash } from '@ckb-lumos/lumos/utils'

export const maxDuration = 300

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl
  const codeHash = searchParams.get('code_hash')
  const hashType = searchParams.get('hash_type')
  const args = searchParams.get('args')

  if (!codeHash || !hashType || !args) {
    return new Response('codeHash, hashType, args are required', { status: 400 })
  }

  const typeScript = { codeHash, hashType, args } as Script
  const typeHash = computeScriptHash(typeScript)

  const allocations = await api.ckb.holder.holderAllocation([{ typeScript, typeHash }])
  const allocation = allocations.get(typeHash)

  if (!allocation) {
    return new Response('holder allocation not found', { status: 404 })
  }

  return Response.json(allocation)
}

export const POST = async (req: Request) => {
  const { scripts } = await req.json()
  if (!scripts) {
    return new Response('list is required', {
      status: 400,
    })
  }
  const holders = await api.ckb.holder.holderAllocation(scripts)
  return Response.json(Object.fromEntries(holders))
}
