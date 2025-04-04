import { validationRouter } from '@/server/api/routers/ckb/validation'
import { addressRouter } from '@/server/api/routers/ckb/address'
import { holderRouter } from '@/server/api/routers/ckb/holder'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ckb: {
    validation: validationRouter,
    address: addressRouter,
    holder: holderRouter,
  },
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
