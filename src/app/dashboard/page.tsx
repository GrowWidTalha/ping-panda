import DashboardPage from "@/components/dashboard-page"
import { db } from "@/db"
import { useUser } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import DashboardPageContent from "./dashboard-page-content"
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createCheckoutSession } from "@/lib/stripe"
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}
const Page = async ({ searchParams }: PageProps) => {
  searchParams.get
  const auth = await currentUser()
  if (!auth) redirect("/sign-in")
  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })

  if (!user) redirect("/sign-in")
  const intent = searchParams.intent
  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    if(session.url) redirect(session.url)
  }

  const success = searchParams.success
  return (
    <>
    {success && <PaymentSuccessDialog />}
    <DashboardPage
      title="Dashboard"
      // hideBackButton
      cta={
        <CreateEventCategoryModal>
          <Button className="w-full sm:w-fit">
            <Plus className="mr-2 size-4" /> Add Category
          </Button>
        </CreateEventCategoryModal>
      }
    >
      <DashboardPageContent />
    </DashboardPage>
    </>

  )
}

export default Page
