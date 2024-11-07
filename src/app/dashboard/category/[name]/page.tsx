import DashboardPage from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import React from "react"
import CategoryPageContent from "./category-page-content"
type Params = Promise<{ name: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
interface Props {
  params: Params
}

async function Page({ params }: Props) {
  const { name } = await params
  if (typeof name !== "string") notFound()
  const auth = await currentUser()
  if (!auth) notFound()
  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })

  if (!user) notFound()
  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name: name,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  })
  if (!category) notFound()
  const hasEvents = category._count.events > 0

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent category={category} hasEvents={hasEvents} />
    </DashboardPage>
  )
}

export default Page
