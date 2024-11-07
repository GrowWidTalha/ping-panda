import React from "react"
import { SignUp } from "@clerk/nextjs"

const SignUpPage = () => {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <SignUp fallbackRedirectUrl={"/welcome"} forceRedirectUrl={"/welcome"} />
    </div>
  )
}

export default SignUpPage
