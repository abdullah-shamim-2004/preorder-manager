// components/preorders/status-toggle.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function StatusToggle({ id, status }: { id: string; status: boolean }) {
  const router = useRouter()
  const [current, setCurrent] = useState(status)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    setCurrent(!current) 
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !current }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setCurrent(current) 
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={current}
      onCheckedChange={handleToggle}
      disabled={loading}
      className="data-[state=checked]:bg-black"
    />
  )
}