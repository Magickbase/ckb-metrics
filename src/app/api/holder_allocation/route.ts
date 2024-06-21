import { api } from '@/trpc/server'

export const POST = async (req: Request) => {
  const { scripts } = await req.json()
  if (!scripts) {
    return new Response('list is required', {
      status: 400,
    })
  }
  const holders = await api.ckb.holder.holderAllocation(scripts)
  return Response.json({ holders: Object.fromEntries(holders) })
}
