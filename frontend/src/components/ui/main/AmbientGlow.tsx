'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function AmbientGlow() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const translateX = useTransform(mouseX, [0, windowSize.width || 1], ['-2%', '2%'])
  // const translateY = useTransform(mouseY, [0, windowSize.height || 1], ['-2%', '2%'])

  const { scrollYProgress } = useScroll()
  const scrollTranslateY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const glowColor = theme === 'dark' ? 'rgba(255,111,97,0.12)' : 'rgba(37, 100, 235, 0.22)'

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  useEffect(() => {
    setMounted(true)
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed top-0 left-1/2 w-[80vw] max-w-[1000px] h-[120vh] -translate-x-1/2 pointer-events-none rounded-full blur-3xl z-0"
      style={{
        translateX,
        translateY: scrollTranslateY,
        background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
        opacity: 0.7,
      }}
      animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      onMouseMove={handleMouseMove}
    />
  )
}
