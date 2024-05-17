import { api } from '@/trpc/server'
import List from './list'

const IncorrectAddresses = async () => {
  const addresses = await api.ckb.address.incorrect()
  return <List addresses={addresses} />
}

export default IncorrectAddresses
