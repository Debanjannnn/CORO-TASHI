"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"

const ContactForm = () => {
  useEffect(() => {
    // Load the Typeform script dynamically after component mounts
    const script = document.createElement("script")
    script.src = "//embed.typeform.com/next/embed.js"
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      // Clean up on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])
  
  return (
    <section className="relative py-20 overflow-hidden bg-black">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Removed the heading and paragraph text */}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]"></div>
          
          {/* Border with gradient */}
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-orange-500/50 via-orange-500/10 to-transparent">
            <div className="absolute inset-0 rounded-2xl bg-zinc-900/80 backdrop-blur-sm"></div>
          </div>
          
          {/* Typeform container */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-1 min-h-[500px]">
            <div className="w-full h-full min-h-[500px]" data-tf-live="01JPPGHXHMYFWA31GQQRFWJR0Y"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm 