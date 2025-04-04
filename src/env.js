import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // POSTGRES_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CKB_RPC_URL: z.string().url(),
    CKB_EXPLORER_URL: z.string().url(),
    TG_TOKEN: z.string().optional(),
    REDIS_URL: z.string().url(),
    CKB_CHAIN_TYPE: z.enum(['mainnet', 'testnet']).default('mainnet'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CKB_RPC_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CKB_RPC_URL: process.env.CKB_RPC_URL,
    CKB_EXPLORER_URL: process.env.CKB_EXPLORER_URL,
    TG_TOKEN: process.env.TG_TOKEN,
    REDIS_URL: process.env.REDIS_URL,
    CKB_CHAIN_TYPE: process.env.CKB_CHAIN_TYPE,
    NEXT_PUBLIC_CKB_RPC_URL: process.env.NEXT_PUBLIC_CKB_RPC_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
