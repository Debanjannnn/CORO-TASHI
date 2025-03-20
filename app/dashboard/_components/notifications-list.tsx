"use client"

import { RefreshCw } from "lucide-react"

interface NotificationsListProps {
  notifications: any[]
  onRefresh: () => Promise<void>
}

export default function NotificationsList({ notifications, onRefresh }: NotificationsListProps) {
  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          aria-label="Refresh notifications"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No notifications available</div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full mr-2">
                    Pool #{notification.poolId}
                  </span>
                  <span className="text-sm text-gray-400">From: {formatAddress(notification.sender)}</span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
              </div>

              <p className="text-white mb-1">{notification.message}</p>

              {notification.amount !== "0.0" && (
                <div className="text-sm text-orange-400">Amount: {notification.amount}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

