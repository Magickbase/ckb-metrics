import { getTipHeader } from '@/utils/ckb/rpc'
import { getTipBlockNumber } from '@/utils/ckb/explorer'
import { validateAddressesInBlock } from '@/utils/ckb/validation'
import { validatedBlockHashes } from '@/utils/state'

export default async () => {
  // Logic is too simple to be in service
  const explorerTipBlockNumber = await getTipBlockNumber()
  if (explorerTipBlockNumber === null) {
    return {
      message: `Explorer Tip Block Number is null`,
    }
  }

  const nodeTipHeader = await getTipHeader()
  if (+nodeTipHeader.number !== explorerTipBlockNumber) {
    return {
      message: `Explorer Tip Block doesn't match ckb node`,
    }
  }

  if (validatedBlockHashes.has(nodeTipHeader.hash)) {
    return {
      message: `Block ${nodeTipHeader.hash} has been verified`,
    }
  }

  if (validatedBlockHashes.size > 100) {
    validatedBlockHashes.clear()
  }

  validatedBlockHashes.add(nodeTipHeader.hash)

  const result = await validateAddressesInBlock(nodeTipHeader.hash)
  return {
    data: result,
  }
}
