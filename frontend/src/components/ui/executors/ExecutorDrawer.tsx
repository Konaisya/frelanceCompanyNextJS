'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Briefcase, Sparkles, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import ServiceCard from '../services/ServiceCard'
import { Service } from '@/types/service'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { profileAPI, Review } from '@/lib/api/axios'
import { useChat } from '@/components/ui/chat/ChatProvider'

interface Executor {
  id: number
  name: string
  image: string
  rating?: number
  completed_projects?: number
  experience?: number
}

interface ExecutorDrawerProps {
  executor: Executor
  services: Service[]
  isOpen: boolean
  onClose: () => void
  onOpenChat: () => void 
}

export default function ExecutorDrawer({ 
  executor, 
  services, 
  isOpen, 
  onClose,
  onOpenChat 
}: ExecutorDrawerProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const { toggleChat } = useChat()

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!executor?.id || !isOpen) return
      
      try {
        setLoadingReviews(true)
        const response = await profileAPI.getReviews({ 
          id_user_target: executor.id 
        })
        const reviewsData: Review[] = response.data
        setReviews(reviewsData)
      } catch (error) {
        console.error('Ошибка загрузки отзывов:', error)
        setReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [executor?.id, isOpen])


  const handleOpenChat = () => {
    toggleChat(executor.id, executor.name, executor.image)

    if(window.innerWidth >= 768) {
      onClose()
    }

    onOpenChat()
  }


  const toggleReview = (reviewId: number) => {
    setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId)
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }


  const getExperienceLevel = (years: number): string => {
    if (years < 1) return 'Стажер'
    if (years >= 1 && years < 3) return 'Junior'
    if (years >= 3 && years < 5) return 'Middle'
    if (years >= 5 && years < 8) return 'Senior'
    return 'Lead'
  }


  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-[var(--card)] z-50 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-[var(--card)] border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)] z-10">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 overflow-hidden rounded-full ring-3 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card)]">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${executor.image}`}
                        alt={executor.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-[var(--accent-text)] rounded-full p-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{executor.name}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{executor.rating?.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{executor.completed_projects} проектов</span>
                      </div>
                      {executor.experience !== undefined && (
                        <>
                          <span>•</span>
                          <span>{getExperienceLevel(executor.experience)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>Услуги исполнителя</span>
                  <span className="text-sm px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full">
                    {services.length}
                  </span>
                </h3>

                <div className="space-y-4">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Отзывы</span>
                    {reviews.length > 0 && (
                      <span className="text-sm px-2 py-1 bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-full">
                        {reviews.length}
                      </span>
                    )}
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {executor.rating?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)]">Пока нет отзывов</p>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      Будьте первым, кто оставит отзыв
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {displayedReviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-xl p-4 hover:border-[color-mix(in_srgb,var(--text)_20%,transparent)] transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] flex items-center justify-center overflow-hidden">
                                {review.user_author.image ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review.user_author.image}`}
                                    alt={review.user_author.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6 text-[var(--accent)] font-semibold">
                                    {review.user_author.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {review.user_author.name}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                                  <span>{formatDate(review.created_at)}</span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{review.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className={`text-sm ${expandedReviewId === review.id ? '' : 'line-clamp-3'}`}>
                              {review.comment}
                            </p>
                            
                            {review.comment.length > 200 && (
                              <button
                                onClick={() => toggleReview(review.id)}
                                className="text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 flex items-center gap-1"
                              >
                                {expandedReviewId === review.id ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Свернуть
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    Читать полностью
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {reviews.length > 3 && (
                      <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full mt-4 py-3 border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg hover:border-[color-mix(in_srgb,var(--text)_25%,transparent)] transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        {showAllReviews ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Свернуть отзывы
                          </>
                        ) : (
                          <>
                            Показать все отзывы ({reviews.length})
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <div className="bg-gradient-to-r from-[var(--accent)]/5 to-[var(--accent)]/10 rounded-xl p-5 border border-[var(--accent)]/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    Заказать услугу
                  </h4>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Свяжитесь с исполнителем напрямую для обсуждения деталей проекта
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleOpenChat}
                      className="flex-1 bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent)]/90 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Написать сообщение
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}