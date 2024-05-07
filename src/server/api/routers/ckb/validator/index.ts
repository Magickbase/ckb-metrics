import { z } from 'zod'
import { validateBalanceByBlock } from '@/utils/ckb/validator'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const validatorRouter = createTRPCRouter({
  balance: publicProcedure.input(z.object({ block_hash: z.string() })).query(async ({ input }) => {
    const blockHash = input.block_hash
    const res = await validateBalanceByBlock(blockHash)
    return {
      ...res,
    }
  }),
})
