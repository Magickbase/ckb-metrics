import { env } from '@/env'

const MAINNET_SCRIPTS = {
  xudt: {
    codeHash: '0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95',
    hashType: 'data1',
  },
}

const TESTNET_SCRIPTS = {}

export const SCRIPTS: {
  xudt?: Record<'codeHash' | 'hashType', string>
} = env.CKB_CHAIN_TYPE === 'mainnet' ? MAINNET_SCRIPTS : TESTNET_SCRIPTS
