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
  const LATENCY = 3 // latency in block number due to performance issue of ckb explorer

  const result = await validateAddressesInBlocks(+nodeTipHeader.number - LATENCY)

  return {
    data: result,
  }
}
