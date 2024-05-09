import { api } from '@/trpc/server'

const IncorrectAddresses = async () => {
  const addresses = await api.ckb.address.incorrect()
  return (
    <div>
      {addresses.map((addr) => {
        return (
          <div id={addr.address}>
            <a href={`https://explorer.nervos.org/address/${addr.address}`} target="_blank">
              {addr.address}
            </a>
            <div>{addr.capacity}</div>
          </div>
        )
      })}
    </div>
  )
}

export default IncorrectAddresses
