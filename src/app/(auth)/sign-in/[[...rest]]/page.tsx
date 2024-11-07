"use client"
import React from "react"
import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

const SignInPage = () => {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      />
    </div>
  )
}

export default SignInPage
