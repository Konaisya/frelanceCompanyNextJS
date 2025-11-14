'use client'

import { motion } from 'framer-motion'
import ServicesList from '@/components/ui/services/ServicesList'


export default function ServicesPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="min-h-screen pt-32 bg-[var(--background)] text-[var(--foreground)]"
    >
      <ServicesList />
    </motion.main>
  )
}
