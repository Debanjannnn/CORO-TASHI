"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import type { JSX } from "react/jsx-runtime"
import { useCoroTashi } from "@/context/CoroTashiContext"
import { useRouter } from "next/navigation" // Import useRouter

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    id: string
    icon?: JSX.Element
  }[]
  className?: string
}) => {

  const { account } = useCoroTashi();
  const router = useRouter(); // Initialize router

  const handleStakeClick = () => {
    if (account === "0x745040302062fBae5F3F68646CF683f75230bE80") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/[0.1] rounded-full bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.2)] z-[5000] pr-2 pl-6 py-2 items-center justify-center space-x-4",
        className,
      )}
    >
      {/* Logo on the left */}
      <Link href="/" className="flex items-center mr-2">
        <div className="relative w-8 h-8 mr-2">
          <Image
            src="/image.png"
            width={40}
            height={40}
            alt="Core Logo"
            className="rounded-full bg-orange-500/20"
          />
          <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-pulse"></div>
        </div>
        <span className="font-bold text-white text-sm hidden sm:inline-block">
          CORO <span className="text-orange-500">TASHI</span>
        </span>
      </Link>

      {navItems.map((navItem, idx) => (
        <Link
          key={`link-${idx}`}
          href={navItem.link || "#"}
          target="_blank"
          className="relative text-neutral-300 items-center flex space-x-1 hover:text-orange-300 transition-colors duration-200 px-2 py-1 text-sm"
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block">{navItem.name}</span>
        </Link>
      ))}

      <button
        onClick={handleStakeClick} // Add click handler
        className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black group"
      >
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#000000_50%,#f97316_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl relative group-hover:bg-black/80 transition-colors duration-200">
          <span className="mr-1">Stake</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
          >
            <path
              d="M6.5 3.5L11 8L6.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute inset-x-0 w-2/3 mx-auto -bottom-px bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px" />
        </span>
      </button>
    </motion.div>
  )
}
