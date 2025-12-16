import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { format, isToday, subDays, addDays } from 'date-fns'
import { useForm, type SubmitHandler } from 'react-hook-form'
// import { useHotkeys } from 'react-hotkeys-hook'

import Button from '@/components/ui/button'
import { api } from '@/trpc/react'
// import users from '@/config/users'
import type { Assignment } from '@/lib/alba/types'
import useAccountCookie from '@/lib/useAccountCookie'

const DATE_FORMAT = 'yyyy-MM-dd'

type Inputs = {
  name: string
  date: string
  completed: boolean
  noAlbaUpdate: boolean
}

export default function Assign({
  assignment: initialAssigment,
}: {
  assignment: Omit<Assignment, 'id'>
}) {
  const { cookie } = useAccountCookie()
  const { data: usersData, isLoading: isLoadingUsers } =
    api.alba.getUsers.useQuery({
      cookie,
    })
  const users = usersData ?? []
  const [assignment, setAssignment] = useState(initialAssigment)
  useEffect(() => {
    setAssignment(initialAssigment)
  }, [initialAssigment])
  const { territoryId, out, name: initialName, date: initialDate } = assignment

  const utils = api.useUtils()
  const { mutate: saveAssignment, isPending: isSaving } =
    api.assignments.create.useMutation({
      onSuccess: async () => {
        await utils.alba.getTerritoryById.invalidate({ id: territoryId })
        await utils.assignments.getAssigmentsByTerritoryId.invalidate({
          id: territoryId,
        })
      },
    })
  const { mutate: reassign, isPending: isReassigning } =
    api.alba.reassign.useMutation({
      onSuccess: async () => {
        await utils.alba.getTerritoryById.invalidate({ id: territoryId })
      },
    })
  const { mutate: complete, isPending: isCompleting } =
    api.alba.complete.useMutation({
      onSuccess: async () => {
        await utils.alba.getTerritoryById.invalidate({ id: territoryId })
      },
    })

  const isLoading = isSaving || isReassigning || isCompleting || isLoadingUsers

  const defaultValues = useMemo(() => {
    return {
      date: out
        ? format(initialDate || new Date(), DATE_FORMAT)
        : format(new Date(), DATE_FORMAT),
      name: out ? initialName : '',
      completed: false,
      noAlbaUpdate: false,
    }
  }, [out, initialDate, initialName])

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues,
    // validate: valuesToValidate => {
    //   const newErrors: Partial<Values> = {}
    //   const { name } = valuesToValidate
    //   if (!name) {
    //     newErrors.name = 'please select name'
    //   }
    //   return newErrors
    // },
  })
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { name, date, completed, noAlbaUpdate } = data
    const [newYear, newMonth, newDay] = date.split('-')
    const newDate = new Date(
      Number(newYear),
      Number(newMonth) - 1,
      Number(newDay)
    )

    const user = users.find(u => name === u.name)
    if (!out) {
      if (user) {
        if (!noAlbaUpdate) {
          reassign({
            date: date,
            territory: territoryId,
            userId: user.id,
            cookie: cookie,
          })
        }
      }
    } else if (completed) {
      if (user) {
        complete({
          date: date,
          territory: territoryId,
          userId: user.id,
          cookie: cookie,
        })
      }
    }
    const newAssignment = {
      date: newDate,
      out: !out,
      territoryId,
      name: name,
    }
    saveAssignment(newAssignment)
    setAssignment(newAssignment)
    // setSubmitting(false)
  }
  const name = getValues('name')
  const date = watch('date')
  const [newYear, newMonth, newDay] = date.split('-')
  const dateAsDate = new Date(
    Number(newYear),
    Number(newMonth) - 1,
    Number(newDay)
  )

  // TODO: add back
  // useHotkeys('j', () => {
  //   // next date
  //   setValue('date', format(addDays(dateAsDate, 1), DATE_FORMAT))
  // })
  // useHotkeys('shift+j', () => {
  //   // next date 7 days from now
  //   setValue('date', format(addDays(dateAsDate, 7), DATE_FORMAT))
  // })
  // useHotkeys('k', () => {
  //   // prev date
  //   setValue('date', format(subDays(dateAsDate, 1), DATE_FORMAT))
  // })
  // useHotkeys('shift+k', () => {
  //   // prev date 7 days ago
  //   setValue('date', format(subDays(dateAsDate, 7), DATE_FORMAT))
  // })
  // useHotkeys('d', () => {
  //   // today date
  //   setValue('date', format(new Date(), DATE_FORMAT))
  // })
  // useHotkeys('a', () => {
  //   // last date
  //   setValue('date', format(initialDate, DATE_FORMAT))
  // })
  // const brotherRef = useRef<HTMLSelectElement | null>(null)
  // useHotkeys('b', () => {
  //   // focus brother dropdown
  //   brotherRef.current?.focus()
  // })
  // useHotkeys('c', () => {
  //   // toggle complete
  //   const completed = getValues('completed')
  //   setValue('completed', !completed)
  // })
  // useHotkeys('n', () => {
  //   // toggle no alba update
  //   const noAlbaUpdate = getValues('noAlbaUpdate')
  //   setValue('noAlbaUpdate', !noAlbaUpdate)
  // })
  // useHotkeys('enter', () => {
  //   // submit - assign/retukrn
  //   void handleSubmit(onSubmit)()
  // })
  return (
    <form className='space-y-2' onSubmit={handleSubmit(onSubmit)}>
      {out ? (
        <input {...register('name')} hidden />
      ) : (
        <select
          {...register('name')}
          className='bg-cb-blue w-full border'
          // ref={brotherRef} // TODO: this is breaking react-hook-form, look into
        >
          <option value=''>Select brother</option>
          {users.map(user => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      )}
      <div className='bg-cb-dusty-blue flex rounded-lg'>
        <button
          type='button'
          className='text-cb-yellow hover:text-cb-yellow/75 flex grow items-center justify-center'
          onClick={() => {
            setValue('date', format(subDays(dateAsDate, 1), DATE_FORMAT))
          }}
        >
          <ChevronLeftIcon className='h-6 w-6' />
        </button>
        <input
          {...register('date')}
          type='date'
          className='bg-cb-blue grow text-center'
        />
        <button
          type='button'
          className='text-cb-yellow hover:text-cb-yellow/75 flex grow items-center justify-center'
          onClick={() => {
            setValue('date', format(addDays(dateAsDate, 1), DATE_FORMAT))
          }}
        >
          <ChevronRightIcon className='h-6 w-6' />
        </button>
      </div>
      {/* {errors.name && <div className='text-red-700'>{errors.name}</div>} */}
      <ul className='flex justify-center space-x-4'>
        <li>
          <button
            className='bg-cb-dusty-blue text-cb-yellow hover:text-cb-yellow/75 rounded-lg px-4 py-2 disabled:pointer-events-none disabled:opacity-25'
            onClick={() => {
              setValue('date', format(initialDate, DATE_FORMAT))
            }}
            disabled={!initialDate || format(initialDate, DATE_FORMAT) === date}
          >
            Last
          </button>
        </li>
        <li>
          <button
            className='bg-cb-dusty-blue text-cb-yellow hover:text-cb-yellow/75 rounded-lg px-4 py-2 disabled:pointer-events-none disabled:opacity-25'
            onClick={() => {
              setValue('date', format(new Date(), DATE_FORMAT))
            }}
            disabled={isToday(dateAsDate)}
          >
            Today
          </button>
        </li>
        {!out && (
          <li className='flex items-center'>
            <label htmlFor='noAlbaUpdate' className='space-x-2'>
              <span>no alba update</span>
              <input
                {...register('noAlbaUpdate')}
                id='noAlbaUpdate'
                type='checkbox'
              />
            </label>
          </li>
        )}
        {out && (
          <li className='flex items-center'>
            <label htmlFor='completed' className='space-x-2'>
              <span>Complete?</span>
              <input
                {...register('completed')}
                id='completed'
                type='checkbox'
              />
            </label>
          </li>
        )}
      </ul>
      <Button
        backgroundColorClassName='bg-cb-off-blue'
        className='disabled:pointer-events-none disabled:opacity-25'
        type='submit'
        disabled={
          isLoading || name === '' || (!out && (!isDirty || isSubmitting))
        }
      >
        {out ? 'Return' : 'Assign'}
        {isLoading ? 'ing' : ''}
      </Button>
    </form>
  )
}
