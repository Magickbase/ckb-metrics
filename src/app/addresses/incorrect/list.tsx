'use client'
import { type FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCellsByAddresses } from './rpc'

const List: FC<{ addresses: Array<{ address: string; error: string | null }> }> = ({ addresses }) => {
  const { data: cells, isLoading } = useQuery({
    queryKey: ['cells', addresses.map((addr) => addr.address)],
    queryFn: () => getCellsByAddresses(addresses.map((addr) => addr.address)),
    enabled: addresses.length > 0,
    initialData: new Map(),
  })

  console.log(cells)
  return (
    <div className="p-4">
      {addresses.map((addr) => {
        return (
          <div id={addr.address} className="mb-8 flex flex-col gap-2 font-mono text-sm leading-none">
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
            <dl>
              <dt>Live Cell Count:</dt>
              <dd>{isLoading ? 'loading' : cells.get(addr.address)?.length ?? 'not counted'}</dd>
            </dl>
          </div>
        )
      })}
    </div>
  )
}

export default List
