'use client'

import { motion } from 'framer-motion';
import { Star, Briefcase, ChevronRight, Package, User } from 'lucide-react';
import { Executor } from '@/types/executor';
import Image from 'next/image';

interface ExecutorCardProps {
  executor: Executor;
  onSelect: () => void;
}

export function ExecutorCard({ executor, onSelect }: ExecutorCardProps) {
  const skills = executor.skills ? executor.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-full overflow-hidden rounded-2xl bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] p-4 sm:p-6 text-left transition-all duration-300 hover:shadow-xl hover:border-[var(--accent)]/30"
    >
      <div className="relative flex flex-col items-center">
        <div className="relative mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 sm:ring-4 ring-[var(--card)] ring-offset-1 sm:ring-offset-2 ring-offset-[var(--bg)] shadow-lg">
            {executor.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${executor.image}`}
                alt={executor.name}
                width={96}
                height={96}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] flex items-center justify-center"> 
                <User className="w-8 h-8 text-[var(--accent)]" />
              </div>
            )}
          </div>
          {typeof executor.rating === 'number' && executor.rating >= 4.5 && (
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-[var(--accent)] to-purple-500 text-white rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-bold shadow-lg">
              TOP
            </div>
          )}

        </div>

        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-[var(--text)] text-center line-clamp-1">
          {executor.name}
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4 text-[var(--text)]">
          {executor.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-semibold">{executor.rating.toFixed(1)}</span>
            </div>
          )}
          {executor.completed_orders !== undefined && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--muted)]" />
              <span className="text-xs sm:text-sm text-[var(--muted)]">{executor.completed_orders}+</span>
            </div>
          )}
          {executor.services_count !== undefined && (
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--muted)]" />
              <span className="text-xs sm:text-sm text-[var(--muted)]">{executor.services_count}</span>
            </div>
          )}
        </div>

        {executor.specialization?.name && (
          <div className="mb-2 sm:mb-3 px-3 py-1 bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] rounded-full">
            <div className="text-xs sm:text-sm text-[var(--muted)] text-center">
              {executor.specialization.name}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-3 sm:mb-4">
            {skills.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 2 && (
              <span className="px-2 py-1 bg-[color-mix(in_srgb,var(--muted)_10%,transparent)] text-[var(--muted)] rounded-full text-xs font-medium">
                +{skills.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 text-[var(--accent)] font-medium text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
          <span className="hidden sm:inline">Посмотреть услуги</span>
          <span className="sm:hidden">Подробнее</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  )
}