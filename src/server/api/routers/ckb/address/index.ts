import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { getIncorrectAddresses } from '@/server/db/queries/addresses'
import { getCapacitiesByAddresses } from '@/utils/ckb/rpc'

export const addressRouter = createTRPCRouter({
  incorrect: publicProcedure.query(async () => {
    const addresses = await getIncorrectAddresses()
    const balance = await getCapacitiesByAddresses(addresses.map((addr) => addr.address))
    return addresses.map((addr, idx) => ({
      address: addr.address,
      capacity: balance[idx]?.capacity,
    }))
  }),
})
