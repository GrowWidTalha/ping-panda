import { db } from "@/db"
import { j } from "./__internals/j"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

const authMiddleware = j.middleware(async ({ next, c }) => {
  const authHeaders = c.req.header("Authorization")

  if (authHeaders) {
    const apiKey = authHeaders.split(" ")[1]
    const user = await db.user.findFirst({
      where: {
        apiKey: apiKey,
      },
    })
    if (user) {
      return next({ user })
    }
  }

  const auth = await currentUser()
  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
  return next({ user })
})

export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = baseProcedure.use(authMiddleware)
