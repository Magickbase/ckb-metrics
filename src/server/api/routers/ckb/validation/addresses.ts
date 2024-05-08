import { getTipHeader } from '@/utils/ckb/rpc'
import { getTipBlockNumber } from '@/utils/ckb/explorer'
import { validateAddressesInBlocks } from '@/utils/ckb/validation'

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

  const result = await validateAddressesInBlocks(+nodeTipHeader.number)
  return {
    data: result,
  }
}
