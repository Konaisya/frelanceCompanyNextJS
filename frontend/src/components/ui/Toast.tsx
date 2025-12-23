// 'use client'

// import { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'

// interface ToastProps {
//   message: string
//   type?: 'success' | 'error' | 'info'
//   duration?: number
//   onClose?: () => void
// }

// export default function Toast({
//   message,
//   type = 'info',
//   duration = 3000,
//   onClose,
// }: ToastProps) {
//   const [visible, setVisible] = useState(true)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setVisible(false)
//       if (onClose) onClose()
//     }, duration)

//     return () => clearTimeout(timer)
//   }, [duration, onClose])

//   const bgColor = {
//     success: 'bg-green-500/90',
//     error: 'bg-red-500/90',
//     info: 'bg-blue-500/90',
//   }[type]

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white shadow-lg ${bgColor} backdrop-blur-sm`}
//         >
//           {message}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }
