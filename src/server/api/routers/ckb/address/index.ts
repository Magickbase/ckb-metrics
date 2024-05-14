import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { getIncorrectAddresses } from '@/server/db/queries/addresses'

export const addressRouter = createTRPCRouter({
  incorrect: publicProcedure.query(async () => {
    const addresses = await getIncorrectAddresses()
    return addresses
  }),
})
