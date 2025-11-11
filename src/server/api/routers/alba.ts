import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import {
  fetchAccount,
  fetchTerritories,
  fetchUsers,
  getAddressList,
  updateAlba,
} from '@/lib/alba'
import type { Territory } from '@/lib/alba/types'
// import { getAssignments } from '@/server/actions'

export const albaRouter = createTRPCRouter({
  getTerritories: publicProcedure
    .input(
      z
        .object({
          cookie: z.string().nullish(),
          search: z.string().nullish(),
          id: z.string().or(z.array(z.string())).nullish(),
        })
        .nullish()
    )
    .query(async ({ input }) => {
      const cookie = input?.cookie ?? undefined
      if (cookie === undefined || cookie === '') {
        return []
      }
      const search = input?.search ?? ''
      const id = input?.id ?? []
      const ids = Array.isArray(id) ? id : [id]

      const alba: Territory[] | null = await fetchTerritories(cookie)

      // TODO: filter by terms other than name
      const territories = alba?.filter(t =>
        ids.length > 0
          ? ids.includes(String(t.id))
          : t.name?.toLowerCase().includes(search.toLowerCase())
      )

      // const assignments = await getAssignments()

      return territories?.map(t => ({
        ...t,
        // assignments: assignments.filter(a => a.territoryId === t.id),
      }))
    }),
  // getTerritoryById: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const id = input.id
  //     const alba = await fetchTerritories()
  //     const index = alba?.findIndex(a => a.id === id)
  //     const territory =
  //       index !== -1 && index !== undefined && alba ? alba[index] : null
  //     const prevIndex = index !== undefined ? index - 1 : null
  //     const prevId =
  //       alba &&
  //       territory &&
  //       prevIndex !== null &&
  //       index !== undefined &&
  //       index > -1
  //         ? alba[prevIndex]?.id
  //         : null
  //     const nextIndex = index !== undefined ? index + 1 : null
  //     const nextId =
  //       alba &&
  //       territory &&
  //       nextIndex !== null &&
  //       index !== undefined &&
  //       index < alba?.length
  //         ? alba[nextIndex]?.id
  //         : null

  //     return {
  //       ...territory,
  //       prevId,
  //       nextId,
  //     }
  //   }),
  // getAddressList: publicProcedure
  //   .input(
  //     z.object({
  //       addressListId: z.string(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const { addressListId } = input

  //     const addressList = await getAddressList(addressListId)
  //     if (addressList.error) {
  //       return {
  //         error: addressList.error,
  //       }
  //     }
  //     return addressList
  //   }),
  // reassign: publicProcedure
  //   .input(
  //     z.object({
  //       territory: z.string(),
  //       date: z.string(),
  //       userId: z.number(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     const { territory, userId, date } = input

  //     const res = await updateAlba({
  //       cmd: 'reassign',
  //       userId,
  //       date,
  //       territory,
  //     })

  //     return res
  //   }),
  // complete: publicProcedure
  //   .input(
  //     z.object({
  //       territory: z.string(),
  //       date: z.string(),
  //       userId: z.number(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     const { territory, userId, date } = input

  //     const res = await updateAlba({
  //       cmd: 'completed',
  //       userId,
  //       date,
  //       territory,
  //     })

  //     return res
  //   }),
  // unassign: publicProcedure
  //   .input(
  //     z.object({
  //       territory: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     const { territory } = input

  //     const res = await updateAlba({
  //       cmd: 'unassign',
  //       territory,
  //     })

  //     return res
  //   }),
  getAccount: publicProcedure
    .input(
      z.object({
        cookie: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const cookie = input?.cookie ?? undefined
      if (cookie === undefined || cookie === '') {
        return null
      }

      const account = await fetchAccount({ cookie })

      return account
    }),
  getUsers: publicProcedure
    .input(
      z.object({
        cookie: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const cookie = input?.cookie ?? undefined
      if (cookie === undefined || cookie === '') {
        return null
      }

      const users = await fetchUsers({ cookie })

      return users
    }),
})
