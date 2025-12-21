import { cubicBezier } from 'framer-motion'

export const panelAnim = {
  initial: {
    opacity: 0,
    x: 80,
    scale: 0.96,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
  exit: {
    opacity: 0,
    x: -80,
    scale: 0.96,
    filter: 'blur(6px)',
    transition: {
      duration: 0.35,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}
