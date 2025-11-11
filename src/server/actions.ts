'use server'

import 'server-only'

import { eq } from 'drizzle-orm'

import { type Assignment } from '@/lib/alba/types'
import { db } from './db'
import { assignments } from './db/schema'

export async function getAssignments(
  props: {
    query?: {
      name?: string
      out?: boolean
      limit?: number
    }
  } = {}
) {
  const { name, limit, out } = props.query ?? {}
  const assignments = await db.query.assignments.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    where: name
      ? (model, { eq }) => eq(model.name, name)
      : out
        ? (model, { eq }) => eq(model.out, out)
        : undefined,
    limit: limit ? Number(limit) : undefined,
  })
  return assignments
}

export async function getAssignmentsByTerritoryId(territoryId: string) {
  const assignments = await db.query.assignments.findMany({
    where: (model, { eq }) => eq(model.territoryId, territoryId),
    orderBy: (model, { desc }) => desc(model.id), // TODO: order by date
  })
  return assignments
}

export async function createAssignment(assignment: Omit<Assignment, 'id'>) {
  const newAssignment = {
    territoryId: assignment.territoryId,
    name: assignment.name,
    date: assignment.date,
    out: assignment.out,
  }

  await db.insert(assignments).values(newAssignment)
}

export async function deleteAssignment(assignmentId: number) {
  await db.delete(assignments).where(eq(assignments.id, assignmentId))
}
