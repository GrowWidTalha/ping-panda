"use client"
import React from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import Heading from "./Heading"
import { useRouter } from "next/navigation"

interface Props {
  title: string
  children?: React.ReactNode
  hideBackButton?: boolean
  cta?: React.ReactNode
}

const DashboardPage = ({ title, children, hideBackButton, cta }: Props) => {
  const router = useRouter()
  return (
    <section className="flex h-full w-full flex-1 flex-col">
      <div className="flex w-full justify-between border-b border-gray-200 p-6 sm:p-8">
        <div className="flex w-full flex-col items-start gap-y-6 sm:flex-row">
          <div className="flex items-center gap-8">
            {hideBackButton ? null : (
              <Button
                onClick={() => router.back()}
                className="w-fit bg-white"
                variant={"outline"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Heading>{title}</Heading>
          </div>
          {cta ? (
            <div className="flex w-full justify-start sm:items-end sm:justify-end">
              {cta}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </section>
  )
}

export default DashboardPage
