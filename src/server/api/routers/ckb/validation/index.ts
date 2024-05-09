import { z } from 'zod'
import { validateAddressesInBlock } from '@/utils/ckb/validation'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import validateAddresses from './addresses'
import revalidate from './revalidate'

export const validationRouter = createTRPCRouter({
  addresses_in_block: publicProcedure.input(z.object({ block_hash: z.string() })).query(async ({ input }) => {
    const blockHash = input.block_hash
    const res = await validateAddressesInBlock(blockHash)
    return {
      ...res,
    }
  }),
  addresses: publicProcedure.query(async () => {
    const res = await validateAddresses()
    return res
  }),
  revalidate: publicProcedure.query(async () => {
    const res = await revalidate()
    return res
  }),
})
