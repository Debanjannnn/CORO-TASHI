"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animated?: boolean
}

export function AnimatedLogo({ size = "md", className = "", animated = true }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Set sizes based on the size prop
  const dimensions = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`relative ${dimensions[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Logo container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          rotate: isVisible ? 0 : -10,
        }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        {/* Outer hexagon */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: animated && !isHovered ? 360 : 0 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
          </svg>
        </motion.div>

        {/* Inner hexagon and cube */}
        <motion.div
          className="w-3/4 h-3/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Inner hexagon */}
            <motion.path
              d="M50 15 L82.5 35 L82.5 65 L50 85 L17.5 65 L17.5 35 Z"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />

            {/* Cube - front face */}
            <motion.path
              d="M50 35 L70 45 L70 65 L50 75 Z"
              fill="#f97316"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            />

            {/* Cube - top edge */}
            <motion.path
              d="M50 35 L30 45 L50 55 L70 45 Z"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />

            {/* Cube - side edge */}
            <motion.path
              d="M50 55 L50 75 L30 65 L30 45 Z"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Particle effects */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 0.7,
              }}
              animate={{
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

