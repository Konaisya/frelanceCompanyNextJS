// 'use client'

// interface Message {
//   id: number
//   sender_id: number
//   recipient_id: number
//   message: string
//   created_at: string
//   is_read: boolean
// }

// interface MessageListProps {
//   messages: Message[]
//   currentUserId: number
// }

// export default function MessageList({ messages, currentUserId }: MessageListProps) {
//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString('ru-RU', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     })
//   }

//   return (
//     <div className="space-y-4">
//       {messages.length === 0 ? (
//         <div className="text-center py-8 text-[var(--muted)]">
//           <p>Начните общение с исполнителем</p>
//         </div>
//       ) : (
//         messages.map((msg) => {
//           const isOwn = msg.sender_id !== currentUserId
          
//           return (
//             <div
//               key={msg.id}
//               className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
//             >
//               <div
//                 className={`max-w-[70%] rounded-xl p-3 ${
//                   isOwn
//                     ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] rounded-tl-none'
//                     : 'bg-[var(--accent)] text-[var(--accent-text)] rounded-tr-none'
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap break-words">{msg.message}</p>
//                 <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
//                   isOwn ? 'text-[var(--muted)]' : 'text-[var(--accent-text)]/80'
//                 }`}>
//                   <span>{formatTime(msg.created_at)}</span>
//                   {!isOwn && msg.is_read && (
//                     <span className="text-[10px]">✓✓</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         })
//       )}
//     </div>
//   )
// }