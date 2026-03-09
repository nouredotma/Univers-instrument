"use client"


import { motion } from "framer-motion"
import Link from "next/link"

// Custom WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-7 md:h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path
      d="M20.636 3.363C18.399 1.193 15.38 0 12.217 0 5.546 0 .123 5.422.123 12.093c0 2.136.553 4.22 1.6 6.067L0 24l6.037-1.584c1.77.966 3.769 1.474 5.8 1.474h.006c6.67 0 12.093-5.422 12.093-12.093 0-3.164-1.193-6.183-3.3-8.434zM12.217 22.093c-1.798 0-3.558-.484-5.097-1.398l-.366-.217-3.8 1.006.996-3.647-.238-.38c-1.003-1.59-1.534-3.43-1.534-5.365 0-5.52 4.488-10.007 10.01-10.007 2.683 0 5.207 1.046 7.115 2.954 1.908 1.908 2.954 4.432 2.954 7.115 0 5.52-4.488 10.007-10.01 10.007z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

export default function FloatingContact() {
  const whatsappNumber = "0666166945"

  return (
    <div className="fixed bottom-2 right-2 z-50 flex flex-col gap-3 items-end">
      {/* WhatsApp Button */}
      <Link 
        href={`https://wa.me/${whatsappNumber}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex"
      >
        <motion.div
          className="w-12 h-12 md:w-14 md:h-14 text-white bg-green-500 rounded-full flex items-center justify-center shadow-lg relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 1 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <WhatsAppIcon />
          </motion.div>
          
          {/* Red Notification Dot */}
          <span className="hidden md:block absolute top-0 right-0 h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 md:h-3.5 md:w-3.5 bg-red-500"></span>
          </span>
        </motion.div>
      </Link>
    </div>
  )
}
