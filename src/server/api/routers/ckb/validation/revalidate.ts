import * as addressesQueries from '@/server/db/queries/addresses'
import { validateAddresses } from '@/utils/ckb/validation'
import { notify } from '@/utils/notifier/tg'

const revalidate = async () => {
  const addresses = await addressesQueries.getIncorrectAddresses().then((list) => list.map((item) => item.address))
  const result = await validateAddresses(addresses)
  const fixed = []
  const remains = []
  if (result) {
    for (const item of result.entries()) {
      if (!item[1].error) {
        fixed.push(item[0])
      } else {
        notify(item[0], item[1].error)
        remains.push(item[0])
      }
    }
  }

  await addressesQueries.batchUpdate(fixed.map((address) => ({ address, isCorrect: true })))

  return { fixed, remains }
}

export default revalidate
