"use client"
import { motion } from "framer-motion"
import { Github, Twitter, DiscIcon as Discord, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const footerLinks = [
    {
      title: "Products",
      links: [
        { name: "TASHIBTC Testnet Faucet", href: "https://coro-tashi-faucet.vercel.app/" },
        { name: "Liquidity Pools", href: "#" },
        { name: "Staking Dashboard", href: "#" },
        { name: "Analytics", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "https://coro-tashi.gitbook.io/coro-tashi" },
        { name: "Tutorials", href: "https://www.youtube.com/@CoroTashi" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Twitter", href: "https://x.com/CoroTashi" },
        { name: "GitHub", href: "https://github.com/PepsiCola-kulfi/CORO-TASHI" },

      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "" },
        { name: "Contact", href: "mailto:corotashi@gmail.com" },
      ],
    },
  ]

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://x.com/CoroTashi" },
    { name: "GitHub", icon: Github, href: "https://github.com/PepsiCola-kulfi/CORO-TASHI" },
  ]

  return (
    <footer className="relative bg-black pt-20 pb-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[120px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=2&width=2')] bg-[length:50px_50px] opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Top border with gradient */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="text-2xl font-bold text-white mb-4">
                CORE <span className="text-orange-500">DAO</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Maximizing yield and optimizing investments in the decentralized finance ecosystem.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-all duration-300"
                  >
                    <link.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      className="text-gray-400 hover:text-orange-400 text-sm flex items-center group transition-colors duration-300"
                    >
                      {link.name}
                      <ArrowUpRight className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-500 text-sm mb-4 md:mb-0"
            >
              © {new Date().getFullYear()} CoreDAO. All rights reserved.
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              <Link href="#" className="text-gray-500 hover:text-orange-400 text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-orange-400 text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-orange-400 text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-0 w-full opacity-10">
          <svg
            width="100%"
            height="2"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="1" x2="100" y2="1" stroke="#f97316" strokeWidth="0.5" strokeDasharray="5,5" />
          </svg>
        </div>
      </div>
    </footer>
  )
}

