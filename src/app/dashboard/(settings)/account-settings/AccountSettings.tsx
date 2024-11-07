"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import React, { useState } from "react"

interface Props {
  discordId: string
}

const AccountSettings = ({ discordId: initialDiscordId }: Props) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.project.setDiscordId.$post({
        discordId: discordId,
      })

      return await res.json()
    },
  })
  return (
    <Card className="w-full max-w-xl space-y-4">
      <div>
        <Label>Discord Id</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord Id"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don&apos;t know how to find your discord Id?{" "}
        <Link
          href={"#"}
          className="cursor-pointer text-brand-600 hover:text-brand-500"
        >
          Learn how to obtain it here.
        </Link>
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </Card>
  )
}

export default AccountSettings
