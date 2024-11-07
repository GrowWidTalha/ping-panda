import { Card } from "@/components/ui/card"
import { db } from "@/db"
import { client } from "@/lib/client"
import { currentUser } from "@clerk/nextjs/server"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Props {
  categoryName: string
}

export const EmptyCategoryState = ({ categoryName }: Props) => {
  const router = useRouter()
  const { data } = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    queryFn: async () => {
      const res = await client.category.pollCategory.$get({
        name: categoryName,
      })
      return await res.json()
    },
    refetchInterval: (query) => {
      return query.state.data?.hasEvents ? false : 1000
    },
  })
  const hasEvents = data?.hasEvents
  useEffect(() => {
    if (hasEvents) {
      router.refresh()
    }
  }, [hasEvents, router])
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await client.auth.getUser.$get()

      return (await res.json()).user
    },
  })
  const codeSnippet = `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v1/event', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${user?.apiKey}'
  },
  body: JSON.stringify({
    category: '${categoryName}',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`
  return (
    <Card
      contentClassName="max-w-2xl w-full flex flex-col items-center justify-center p-6"
      className="flex flex-1 items-center justify-center"
    >
      <h2 className="text-center text-xl/8 font-medium tracking-tight text-gray-950">
        Create your first {categoryName} event.
      </h2>
      <p className="mb-8 max-w-md text-center text-sm/6 text-gray-600">
        Get started by sending a request to our tracking API:
      </p>
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400">your-first-event.js</span>
        </div>
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{
            borderRadius: "0px",
            margin: "0px",
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      </div>
      <div className="mt-8 flex flex-col items-center space-x-2">
        <div className="flex items-center space-x-2">
          <div className="size-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">
            Listening to Incoming events...
          </span>
        </div>
        <p className="mt-2 text-sm/6 text-gray-600">
          Need help? Check our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            documentation
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </Card>
  )
}
