"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { JSX } from "react/jsx-runtime";
import { useCoroTashi } from "@/context/CoroTashiContext";
import { useRouter } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    id: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { connectWallet, isConnected } = useCoroTashi();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() || 0);
      setTimeout(() => {
        setVisible(scrollYProgress.get() < 0.05 || direction < 0);
      }, 100);
    }
  });

  const handleStake = async() => {
    try {
      // Check if wallet is already connected
      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect...");
        await connectWallet();
        
        // Verify connection was successful before proceeding
        if (!isConnected) {
          console.log("Wallet connection failed or was cancelled");
          return; // Exit early if connection failed
        }
      }
      
      console.log("Wallet connected, redirecting to dashboard...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in handleStake:", error);
      // You might want to add user feedback here, such as a toast notification
      alert("Failed to connect wallet. Please try again.");
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 1 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black shadow-lg z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {/* Logo on the left */}
        <Link href="/">
          <Image src="/corelogo.png" width={40} height={40} alt="Core Logo" className="rounded-full" />
        </Link>

        {isMounted &&
          navItems.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              href={navItem.link}
              onClick={(e) => {
                if (navItem.id) {
                  e.preventDefault();
                  const element = document.getElementById(navItem.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    console.warn(`Element with id ${navItem.id} not found.`);
                  }
                }
              }}
              className="relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300"
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          ))}

        <button  onClick={handleStake} className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFA500_0%,#000000_50%,#FFFFFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-5 py-1 text-xs font-medium text-white backdrop-blur-3xl relative">
            Stake
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px" />
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
