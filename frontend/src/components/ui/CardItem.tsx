// 'use client'

// import { motion } from 'framer-motion'
// import Image from 'next/image'

// interface CardItemProps {
//   title: string
//   description: string
//   image?: string
//   onClick?: () => void
// }

// export default function CardItem({ title, description, image, onClick }: CardItemProps) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-[var(--glass)] p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
//     >
//       {image && (
//         <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
//           <Image src={image} alt={title} className="w-full h-full object-cover" />
//         </div>
//       )}
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-muted text-sm leading-relaxed">{description}</p>
//     </motion.div>
//   )
// }
