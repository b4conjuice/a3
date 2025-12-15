import { useSearchParams, NavLink as Link } from 'react-router'
import {
  ArrowTopRightOnSquareIcon,
  ListBulletIcon,
  PrinterIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid'

import { format } from 'date-fns'
import classNames from 'classnames'

import type { Territory } from '@/lib/alba/types'
import mcmxivUrl from '@/lib/alba/mcmxiv-url'

export default function TerritoryListItem({
  territory,
}: {
  territory: Territory
}) {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')

  const {
    id,
    name,
    addresses,
    status,
    out,
    person,
    dateString,
    url,
    print,
    details,
    assignments,
  } = territory

  const firstAssignment = assignments ? assignments[0] : undefined
  const needsUpdate = (status === 'Signed-out') !== firstAssignment?.out
  return (
    <li key={id} className='py-4 first:pt-0'>
      <h2 className='flex items-center space-x-4'>
        <Link
          to={`/territories/${id}${q ? `?q=${q}` : ''}`}
          className='text-cb-pink hover:text-cb-pink/75 truncate text-lg'
        >
          {name}
        </Link>
        <span className='text-sm'>{addresses}</span>
      </h2>
      <p className='font-bold'>
        <span className={classNames(out ? 'text-blue-400' : 'text-green-700')}>
          {status}
        </span>
        {out ? (
          <>
            {' '}
            by <span className='text-cb-orange'>{person}</span>
          </>
        ) : null}
      </p>
      {!out && <p>{details}</p>}
      {out && dateString ? (
        <p>
          on <span className='text-cb-mint'>{dateString}</span>
        </p>
      ) : null}
      {needsUpdate &&
        firstAssignment &&
        (firstAssignment.out ? (
          <>
            <p className='font-bold'>
              <span className='text-blue-400'>Signed-out</span> by{' '}
              <span className='text-cb-orange'>{firstAssignment.name}</span>
            </p>
            <p>
              on{' '}
              <span className='text-cb-mint'>
                {format(firstAssignment.date, 'MMMM d, yyyy')}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className='font-bold'>
              <span className='text-green-700'>Available</span>
            </p>
            <p>
              Last completed {format(firstAssignment.date, 'MMMM d, yyyy')} by{' '}
              {firstAssignment.name}
            </p>
          </>
        ))}
      <ul className='flex'>
        <li className='grow'>
          <Link
            to={`/territories/${id ?? ''}${q ? `?q=${q}` : ''}`}
            className='flex items-center space-x-1 md:hover:text-blue-700 md:dark:hover:text-blue-300'
          >
            <span className='hidden lg:inline'>Assign</span>
            <UserPlusIcon
              className={classNames(
                'h-6 w-6',
                needsUpdate
                  ? 'text-cb-pink hover:text-cb-pink/75'
                  : 'text-cb-yellow hover:text-cb-yellow/75'
              )}
            />
          </Link>
        </li>
        <li className='grow'>
          <a
            href={url ?? ''}
            target='_blank'
            rel='noopener noreferrer'
            className={classNames(!url && 'pointer-events-none opacity-25')}
          >
            <ArrowTopRightOnSquareIcon className='text-cb-yellow hover:text-cb-yellow/75 h-6 w-6' />
          </a>
        </li>
        <li className='grow'>
          <Link
            to={`/territories/${id ?? ''}/${(url ?? '').replace(
              mcmxivUrl,
              ''
            )}${q ? `?q=${q}` : ''}`}
            className={classNames(
              'text-cb-yellow hover:text-cb-yellow/75',
              url ? '' : 'pointer-events-none cursor-default opacity-25'
            )}
          >
            <ListBulletIcon className='h-6 w-6' />
          </Link>
        </li>
        <li className='grow'>
          <a href={print} target='_blank' rel='noopener noreferrer'>
            <PrinterIcon className='text-cb-yellow hover:text-cb-yellow/75 h-6 w-6' />
          </a>
        </li>
      </ul>
    </li>
  )
}
