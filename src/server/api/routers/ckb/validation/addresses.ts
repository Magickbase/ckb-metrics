import { getTipHeader } from '@/utils/ckb/rpc'
import { getTipBlockNumber } from '@/utils/ckb/explorer'
import { validateAddressesInBlocks } from '@/utils/ckb/validation'
import { validatedBlockHashes } from '@/utils/state'

export default async () => {
  // Logic is too simple to be in service
  const [explorerTipBlockNumber, nodeTipHeader] = await Promise.all([getTipBlockNumber(), getTipHeader()])

  if (explorerTipBlockNumber === null) {
    return {
      message: `Explorer Tip Block Number is null`,
    }
  }

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

  const result = await validateAddressesInBlocks(+nodeTipHeader.number)
  return {
    data: result,
  }
}
