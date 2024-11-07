"use client"

import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Modal } from "./ui/modal"
import LoadingSpinner from "./LoadingSpinner"
import Image from "next/image"
import { Button } from "./ui/button"
import { CheckIcon } from "lucide-react"

const PaymentSuccessDialog = () => {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const { data, isPending } = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const res = await client.payment.getUserPlan.$get()
      return await res.json()
    },
    refetchInterval: (query) => {
      return query.state.data?.plan === "PRO" ? false : 1000
    },
  })
  const handleClose = () => {
    setOpen(false)
    router.push("/dashboard")
  }

  const isPaymentSuccessful = data?.plan === "PRO"

  return (
    <Modal
      showModal={open}
      setShowModal={setOpen}
      onClose={handleClose}
      className="px-6 pt-6"
      preventDefaultClose={!isPaymentSuccessful}
    >
      <div className="flex flex-col items-center">
        {isPending || !isPaymentSuccessful ? (
          <div className="flex h-56 flex-col items-center justify-center">
            <LoadingSpinner className="mb-4" />
            <p className="text-lg/7 font-medium text-gray-900">
              Upgrading to PRO...
            </p>
            <p className="mt-2 text-pretty text-center text-sm text-gray-600">
              Please wait while process your upgrade. This may take a moment
            </p>
          </div>
        ) : (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <Image
                src={"/brand-asset-heart.png"}
                fill
                className="h-full w-full object-cover"
                alt="payment successful"
              />
            </div>
            <div className="mt-6 flex flex-col items-center gap-1 text-center">
              <p className="text-pretty text-lg/7 font-medium tracking-tight">
                Upgrade Successful 🎉
              </p>
              <p className="text-pretty text-sm/7 text-gray-600">
                Thank you for upgrading and supporting PingPanda. Your account
                has been upgraded.
              </p>
            </div>
            <div className="mt-8 w-full">
              <Button onClick={handleClose} className="h-12 w-full">
                <CheckIcon className="mr-2 size-5" />
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default PaymentSuccessDialog
