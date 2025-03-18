"use client"
import React, { useRef } from "react"
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion"

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20 bg-black"
      ref={containerRef}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=2&width=2')] bg-[length:50px_50px] opacity-[0.03]"></div>
      </div>

      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} opacity={opacity}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  opacity,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  opacity: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        opacity,
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full relative rounded-[30px] shadow-2xl"
    >
      {/* Card border with gradient */}
      <div className="absolute inset-0 rounded-[30px] p-[2px] bg-gradient-to-b from-orange-500/80 via-orange-500/20 to-transparent">
        <div className="absolute inset-0 rounded-[30px] bg-[#111] backdrop-blur-sm"></div>
      </div>

      {/* Card content */}
      <div className="relative h-full w-full p-2 md:p-6 rounded-[28px] overflow-hidden border border-white/10 bg-[#111]">
        <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-4">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
          </div>

          {children}
        </div>
      </div>
    </motion.div>
  )
}

