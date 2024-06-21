import z from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { batchGet, update, syncAll } from '@/server/db/queries/holders'
import { getHolderAllocation } from '@/utils/ckb/getHolderAllocation'

export const holderRouter = createTRPCRouter({
  holderAllocation: publicProcedure
    .input(
      z.array(
        z.object({
          typeHash: z.string(),
          typeScript: z.object({
            codeHash: z.string(),
            hashType: z.string(),
            args: z.string(),
          }),
        }),
      ),
    )
    .query(async ({ input }) => {
      const res = new Map()
      const typeHashes = input.map((item) => item.typeHash)
      const holders = await batchGet(typeHashes)

      for (const i of input) {
        if (holders.has(i.typeHash)) {
          res.set(i.typeHash, holders.get(i.typeHash))
          continue
        }
        const allocation = Object.fromEntries(
          await getHolderAllocation({
            codeHash: i.typeScript.codeHash,
            hashType: i.typeScript.hashType as any,
            args: i.typeScript.args,
          }),
        )
        await update({
          typeHash: i.typeHash,
          codeHash: i.typeScript.codeHash,
          hashType: i.typeScript.hashType,
          args: i.typeScript.args,
          holders: allocation,
        })
        res.set(i.typeHash, allocation)
      }
      return res
    }),
  sync: publicProcedure.query(async () => {
    syncAll()
    return true
  }),
})
