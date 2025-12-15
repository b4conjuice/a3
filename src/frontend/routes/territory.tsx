import { useState } from 'react'
import {
  useSearchParams,
  NavLink as Link,
  useParams,
  useNavigate,
} from 'react-router'
import {
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  PrinterIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'
import classNames from 'classnames'
// import { useHotkeys } from 'react-hotkeys-hook'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Main, Title } from '@/components/ui'
import LoadingIcon from '@/components/ui/loading-icon'
import Button from '@/components/ui/button'
import { api } from '@/trpc/react'
import Assign from '@/components/assign'
import Assignment from '@/components/assignment'
// import ToolsModal from '@/components/tools-modal'
import Modal from '@/components/modal'
import mcmxivUrl from '@/lib/alba/mcmxiv-url'
import Layout from '@/components/layout'

export default function TerritoryPage() {
  const navigate = useNavigate()
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false)
  const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] =
    useState(false)
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')

  const [cookie] = useLocalStorage('a3-cookie', '')
  const { data: territory, isLoading: isLoadingTerritory } =
    api.alba.getTerritoryById.useQuery({
      id: id!,
      cookie,
    })
  const {
    data: assignments,
    isLoading: isLoadingAssigments,
    isRefetching: isRefetchingAssigments,
  } = api.assignments.getAssigmentsByTerritoryId.useQuery({
    id: id!,
  })

  const utils = api.useUtils()
  const { mutate: unassign, isPending: isUnassigning } =
    api.alba.unassign.useMutation({
      onSuccess: async () => {
        await utils.alba.getTerritoryById.invalidate({ id })
      },
    })

  const nextTerritoryUrl = territory?.nextId
    ? `/territories/${territory.nextId}${q ? `?q=${q}` : ''}`
    : ''
  const prevTerritoryUrl = territory?.prevId
    ? `/territories/${territory.prevId}${q ? `?q=${q}` : ''}`
    : ''
  // useHotkeys('l', () => {
  //   // next territory
  //   if (nextTerritoryUrl) {
  //     void navigate(nextTerritoryUrl)
  //   }
  // })
  // useHotkeys('h', () => {
  //   // prev territory
  //   if (prevTerritoryUrl) {
  //     void navigate(prevTerritoryUrl)
  //   }
  // })
  // useHotkeys('t', () => {
  //   // open tools modal
  //   setIsToolsModalOpen(!isToolsModalOpen)
  // })
  // useHotkeys('q', () => {
  //   // open keyboard shortcuts modal
  //   setIsKeyboardShortcutsModalOpen(!isKeyboardShortcutsModalOpen)
  // })

  if (isLoadingTerritory || !territory) {
    return (
      <Main className='flex flex-col p-4'>
        <LoadingIcon className='animate-spin-slow h-16 w-16 text-blue-700 dark:text-blue-200' />
      </Main>
    )
  }
  const { name, addresses, details, url, print, prevId, nextId, out } =
    territory

  const [latestAssignment, ...restOfAssignments] = assignments ?? []
  return (
    <>
      <Layout>
        <div className='flex'>
          <div className='grow'>
            <div className='flex items-center space-x-4'>
              <Title>{name}</Title>
              <span>{addresses}</span>
            </div>
            {details && <p>{details}</p>}
          </div>
          {out && (
            <Button
              backgroundColorClassName='bg-cb-off-blue'
              displayClassName='inline'
              widthClassName='w-auto'
              type='button'
              onClick={() => {
                unassign({ territory: id!, cookie: cookie })
              }}
              disabled={isUnassigning}
            >
              unassign
            </Button>
          )}
        </div>
        <hr className='border-cb-off-blue my-2 border-2' />
        {latestAssignment && (
          <Assignment
            assignment={latestAssignment}
            assignmentId={latestAssignment.id}
          />
        )}
        <Assign
          assignment={
            latestAssignment ?? {
              territoryId: id!,
              out: false,
              name: '',
              date: new Date(),
            }
          }
        />
        {restOfAssignments.length > 0 ? (
          <ul className='divide-cb-dusty-blue divide-y'>
            {restOfAssignments.map(assignment => {
              return (
                <li
                  key={assignment.id}
                  className='mt-4 pt-4 first:mt-0 first:pt-0 last:pb-4'
                >
                  <Assignment
                    assignment={assignment}
                    assignmentId={assignment.id}
                  />
                </li>
              )
            })}
          </ul>
        ) : null}
      </Layout>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-4'>
        <div className='flex space-x-4'>
          <Link
            to={`/assigned${q ? `?q=${q}` : ''}`}
            className='text-cb-yellow hover:text-cb-yellow/75'
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'>
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
          <button
            className={classNames(
              'text-cb-yellow hover:text-cb-yellow/75',
              url ? '' : 'pointer-events-none cursor-default opacity-25'
            )}
            type='button'
            onClick={() => {
              setIsToolsModalOpen(!isToolsModalOpen)
            }}
          >
            <SparklesIcon className='h-6 w-6' />
          </button>
          <a
            href={print}
            target='_blank'
            rel='noopener noreferrer'
            className='text-cb-yellow hover:text-cb-yellow/75'
          >
            <PrinterIcon className='h-6 w-6' />
          </a>
          <a
            href={url ?? ''}
            target='_blank'
            rel='noopener noreferrer'
            className={classNames(
              'text-cb-yellow hover:text-cb-yellow/75',
              url ? '' : 'pointer-events-none cursor-default opacity-25'
            )}
          >
            <ArrowTopRightOnSquareIcon className='h-6 w-6' />
          </a>
          <Link
            to={prevId ? `/territories/${prevId}${q ? `?q=${q}` : ''}` : ''}
            className={classNames(
              'text-cb-yellow hover:text-cb-yellow/75',
              prevId ? '' : 'pointer-events-none cursor-default opacity-25'
            )}
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
          <Link
            to={nextId ? `/territories/${nextId}${q ? `?q=${q}` : ''}` : ''}
            className={classNames(
              'text-cb-yellow hover:text-cb-yellow/75',
              nextId ? '' : 'pointer-events-none cursor-default opacity-25'
            )}
          >
            <ChevronRightIcon className='h-6 w-6' />
          </Link>
        </div>
      </footer>

      {/* {url && ( // TODO: add back
        <ToolsModal
          url={url}
          isToolsModalOpen={isToolsModalOpen}
          setIsToolsModalOpen={setIsToolsModalOpen}
        />
      )} */}
      <Modal
        isOpen={isKeyboardShortcutsModalOpen}
        setIsOpen={setIsKeyboardShortcutsModalOpen}
        title='keyboard shortcuts'
      >
        <dl>
          <dt>l/h</dt>
          <dd>next/prev territory</dd>
          <dt>t</dt>
          <dd>toggle tools</dd>
          <dt>j/k</dt>
          <dd>next/prev date</dd>
          <dt>shift+j/k</dt>
          <dd>next date 7 days from now /prev date 7 days ago</dd>
          <dt>a</dt>
          <dd>last date</dd>
          <dt>b</dt>
          <dd>focus brother dropdown</dd>
          <dt>c</dt>
          <dd>toggle complete</dd>
          <dt>n</dt>
          <dd>toggle no alba update</dd>
          <dt>enter</dt>
          <dd>submit - assign/return</dd>
          <dt>?</dt>
          <dd>list of keyboard shortcuts</dd>
        </dl>
      </Modal>
    </>
  )
}
