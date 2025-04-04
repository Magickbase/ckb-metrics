import Redis from 'ioredis'
import { env } from '@/env'

const redis = new Redis(env.REDIS_URL)

export const db = redis

// Helper functions for common Redis operations
export const get = async (key: string) => {
  const value = await redis.get(key)
  return value ? JSON.parse(value) : null
}

export const set = async (key: string, value: any, expireSeconds?: number) => {
  const stringValue = JSON.stringify(value)
  if (expireSeconds) {
    await redis.setex(key, expireSeconds, stringValue)
  } else {
    await redis.set(key, stringValue)
  }
}

export const del = async (key: string) => {
  await redis.del(key)
}

export const exists = async (key: string) => {
  return await redis.exists(key)
}
