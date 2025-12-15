import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import Button from '@/components/ui/button'
import { api } from '@/trpc/react'
import Modal from '@/components/modal'
import type { Assignment as AssignmentType } from '@/lib/alba/types'

export default function Assignment({
  assignment,
  assignmentId,
}: {
  assignment: AssignmentType
  assignmentId: number
}) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const utils = api.useUtils()
  const { mutate: deleteAssignment } = api.assignments.delete.useMutation({
    onSuccess: async () => {
      await utils.assignments.getAssigmentsByTerritoryId.invalidate({
        id: assignment.territoryId,
      })
    },
  })
  return (
    <div>
      <div className='flex'>
        <span className='grow'>
          {assignment.out ? 'Signed Out' : 'Available'}
        </span>
        <button
          onClick={() => {
            setIsConfirmModalOpen(true)
          }}
        >
          <TrashIcon className='h-6 w-6 text-red-700 hover:text-red-700/75' />
        </button>
      </div>
      <div>{assignment.name}</div>
      <div>
        {!assignment.out && 'Returned on '}
        {format(assignment.date, 'E MMM d, yyyy')}
      </div>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to delete?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={() => {
              deleteAssignment({ id: assignmentId })
              setIsConfirmModalOpen(false)
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </div>
  )
}
