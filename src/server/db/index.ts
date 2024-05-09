import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'
import type { Database } from '@/server/db/database.types'

export const db = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY)
export * from '@/server/db/database.types'
