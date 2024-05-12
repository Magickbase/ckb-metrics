import { env } from '@/env'

export default {
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  url: env.DATABASE_URL,
  tablesFilter: ['ckb-metrics_*'],
}
