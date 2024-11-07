import { auth, currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/db"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    const authe = await auth()
    console.log(authe)
    if (!auth) {
      return c.json({ isSynced: false, auth: auth })
    }
    const user = await db.user.findFirst({
      where: {
        externalId: authe.userId,
      },
    })

    if (!user) {
      await db.user.create({
        data: {
          quotaLimit: 100,
          email: auth.emailAddresses[0].emailAddress,
          externalId: auth.id,
        },
      })

      return c.json({ isSynced: true })
    }

    return c.json({ isSynced: true })
  }),
  getUser: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    return c.json({ user })
  }),
})
