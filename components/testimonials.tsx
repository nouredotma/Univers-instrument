"use client"

import { useRef, useState } from "react"
import { Star, ThumbsUp } from "lucide-react"
import "swiper/css"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"

const testimonials = [
  {
    name: "Fatima-Zahra El Alaoui",
    location: "Marrakech, Morocco",
    text: "Univers Instrument Service is our primary partner for laboratory equipment. Their maintenance service is top-notch and ensures our operations run smoothly.",
    rating: 5,
    image: "/profile-woman.jpg",
  },
  {
    name: "Ahmed Benjelloun",
    location: "Casablanca, Morocco",
    text: "Highly recommend Univers Instrument Service for medical instrumentation. We have been working with them for years and the reliability is unmatched.",
    rating: 5,
    image: "/profile-man.jpg",
  },
  {
    name: "Dr. Youssef El Mansouri",
    location: "Rabat, Morocco",
    text: "The technical expertise of the UIS team is impressive. They provided a full solution for our new clinic, from installation to staff training.",
    rating: 5,
    image: "/profile-man.jpg",
  },
  {
    name: "Nadia Benkirane",
    location: "Tanger, Morocco",
    text: "Fast response times and genuine spare parts. Univers Instrument Service is definitely the best choice for scientific equipment in Morocco.",
    rating: 5,
    image: "/profile-woman-2.jpg",
  },
  {
    name: "Dr. Karim Tazi",
    location: "Fès, Morocco",
    text: "Professionalism and quality. Every instrument we've sourced from UIS meets the highest standards. Their after-sales support is excellent.",
    rating: 5,
    image: "/profile-man.jpg",
  },
  {
    name: "Hind Bousfiha",
    location: "Agadir, Morocco",
    text: "A very reactive team that understands the urgency of medical sectors. UIS has never failed us in providing critical maintenance.",
    rating: 5,
    image: "/profile-woman-2.jpg",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useLanguage()

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white">
      <div className="max-w-full mx-auto px-4 md:px-12">
        <div className="flex flex-col gap-3 sm:gap-8 mb-3 sm:mb-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary">
              <span className="text-lg font-semibold font-fauna">
                {t.testimonials.title} <span className="text-secondary">{t.testimonials.titleHighlight}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            loop={true}
            speed={700}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="testimonial-swiper"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="px-1 py-1 flex flex-col h-full">
                  <div className="bg-[#414141] rounded-md transition-all duration-300 p-4 h-full flex flex-col border border-white/10 md:min-h-[220px]">
                    {/* Header: Profile Top Left, Google Info Top Right */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-600 relative border border-white/10">
                          <Image
                            src={t.image || "/placeholder.svg"}
                            alt={t.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm leading-tight">{t.name}</h3>
                          <p className="text-white/60 text-[11px] mt-0.5">{t.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Google</span>
                        </div>
                        <div className="flex">
                          {[...Array(t.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="grow flex items-center">
                      <p className="text-sm leading-relaxed text-white/80 italic">"{t.text}"</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-swiper .swiper-slide {
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          transform: scale(0.96);
          height: auto;
          padding: 20px 0;
          opacity: 0.7;
        }

        .testimonial-swiper .swiper-slide-active {
          transform: scale(1);
          z-index: 2;
          opacity: 1;
        }

        @media (max-width: 767px) {
          .testimonial-swiper .swiper-slide {
            opacity: 1 !important;
            transform: scale(0.98);
          }
          
          .testimonial-swiper .swiper-slide-active {
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  )
}
