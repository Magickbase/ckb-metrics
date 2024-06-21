import { api } from '@/trpc/server'

export const POST = async (req: Request) => {
  const { scripts } = await req.json()
  if (!scripts) {
    return new Response('list is required', {
      status: 400,
    })
  }
  const holders = await api.ckb.holder.holderAllocation(scripts)
  return new Response(JSON.stringify(Object.fromEntries(holders)), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
