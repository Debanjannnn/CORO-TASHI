"use client"
import { useState } from "react"
import type React from "react"

interface NotificationFormProps {
  pools: any[]
  activePool: number
  setActivePool: (poolId: number) => void
  onSubmit: (poolId: number, amount: string, message: string) => Promise<boolean>
}

export default function NotificationForm({ pools, activePool, setActivePool, onSubmit }: NotificationFormProps) {
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationAmount, setNotificationAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const success = await onSubmit(activePool, notificationAmount, notificationMessage)
      if (success) {
        setNotificationMessage("")
        setNotificationAmount("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden sticky top-4">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold">Create Notification</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-400 mb-1">Pool</label>
            <select
              value={activePool}
              onChange={(e) => setActivePool(Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  Pool #{pool.id}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-400 mb-1">Amount (Optional)</label>
            <input
              type="text"
              value={notificationAmount}
              onChange={(e) => setNotificationAmount(e.target.value)}
              placeholder="0.0"
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={!notificationMessage || isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Post Notification"}
          </button>
        </form>
      </div>
    </div>
  )
}

