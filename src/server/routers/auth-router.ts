import { currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/db"

export const dynamic = "force-dynamic"


export const authRouter = router({
    getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
        console.log("Starting getDatabaseSyncStatus");
        try {
          const auth = await currentUser()
          console.log("Auth result:", auth);

          if (!auth) {
            console.log("No auth found, returning isSynced: false");
            return c.json({ isSynced: false, auth: null })
          }

          console.log("Searching for user with externalId:", auth.id);
          const user = await db.user.findFirst({
            where: {
              externalId: auth.id,
            },
          })

          if (!user) {
            console.log("User not found, creating new user");
            await db.user.create({
              data: {
                quotaLimit: 100,
                email: auth.emailAddresses[0].emailAddress,
                externalId: auth.id,
              },
            })
            console.log("New user created");
          } else {
            console.log("Existing user found");
          }

          return c.json({ isSynced: true })
        } catch (error: any) {
          console.error("Error in getDatabaseSyncStatus:", error);
          return c.json({ isSynced: false, error: error.message })
        }
      }),
  getUser: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    return c.json({ user })
  }),
})
