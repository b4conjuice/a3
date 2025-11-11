import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  getAssignmentsByTerritoryId,
} from '@/server/actions'

export const assignmentsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const assignments = await getAssignments()
    return assignments
  }),
  search: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        limit: z.number().nullish(),
        out: z.boolean().nullish(),
      })
    )
    .query(async ({ input }) => {
      const name = input.name ?? ''
      const limit = input.limit ?? 10
      const out = input.out ?? undefined

      const assignments = await getAssignments({
        query: {
          name,
          limit,
          out,
        },
      })
      return assignments
    }),
  getAssigmentsByTerritoryId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const id = input.id
      const assignments = await getAssignmentsByTerritoryId(id)
      return assignments
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        territoryId: z.string(),
        out: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const assignment = {
        date: input.date,
        out: input.out,
        territoryId: input.territoryId,
        name: input.name,
      }
      await createAssignment(assignment)
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteAssignment(input.id)
    }),
})
