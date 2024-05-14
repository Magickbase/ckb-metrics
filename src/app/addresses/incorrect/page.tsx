import { api } from '@/trpc/server'

const IncorrectAddresses = async () => {
  const addresses = await api.ckb.address.incorrect()
  return (
    <div>
      {addresses.map((addr) => {
        return (
          <div id={addr.address} className="mb-4 font-mono text-sm leading-none">
            <dl>
              <dt>address:</dt>
              <dd>
                <a
                  href={`https://explorer.nervos.org/address/${addr.address}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {addr.address}
                </a>
              </dd>
            </dl>
            <dl>
              <dt>error: </dt>
              <dd>{addr.error}</dd>
            </dl>
          </div>
        )
      })}
    </div>
  )
}

export default IncorrectAddresses
