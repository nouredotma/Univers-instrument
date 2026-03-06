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
    name: "Sarah Johnson",
    role: "Luxury Traveler",
    text: "Outstanding service and professional drivers. Made our Morocco trip unforgettable! The attention to detail and local knowledge made all the difference.",
    rating: 5,
    image: "/profile-woman.jpg",
    date: "2 weeks ago",
    platform: "google",
    helpful: 12,
    location: "New York, USA",
  },
  {
    name: "Michael Brown",
    role: "Business Executive",
    text: "Reliable, punctual, and always friendly. Highly recommend for any travel needs. Used them for multiple airport transfers during my business trip.",
    rating: 5,
    image: "/profile-man.jpg",
    date: "1 month ago",
    platform: "tripadvisor",
    helpful: 8,
    location: "London, UK",
  },
  {
    name: "Emma Wilson",
    role: "Tour Group Manager",
    text: "Perfect coordination and excellent knowledge of local attractions. Top-notch! Our entire group was impressed with the professionalism.",
    rating: 5,
    image: "/profile-woman-2.jpg",
    date: "3 weeks ago",
    platform: "google",
    helpful: 15,
    location: "Sydney, Australia",
  },
  {
    name: "David Martinez",
    role: "Corporate Travel Manager",
    text: "Exceptional service for our team retreat. The drivers were knowledgeable and courteous throughout. Would definitely book again!",
    rating: 5,
    image: "/profile-man.jpg",
    date: "1 week ago",
    platform: "tripadvisor",
    helpful: 6,
    location: "Toronto, Canada",
  },
  {
    name: "Lisa Anderson",
    role: "Travel Blogger",
    text: "An incredible experience! From airport to destination, everything was seamlessly organized. Best transfer service I've used in Morocco.",
    rating: 5,
    image: "/profile-woman-2.jpg",
    date: "4 days ago",
    platform: "google",
    helpful: 23,
    location: "Los Angeles, USA",
  },
  {
    name: "James Thompson",
    role: "Hotel Concierge",
    text: "We recommend Univers Instrument Service to all our guests. They never disappoint! Consistent quality and reliability every single time.",
    rating: 5,
    image: "/profile-man.jpg",
    date: "2 months ago",
    platform: "tripadvisor",
    helpful: 19,
    location: "Paris, France",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useLanguage()

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        <div className="flex flex-col gap-3 sm:gap-8 mb-3 sm:mb-6">
          <div className="flex justify-center md:hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary">
              <span className="text-lg font-semibold">{t.testimonials.title} <span className="text-secondary">{t.testimonials.titleHighlight}</span></span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-between gap-2 sm:gap-6 flex-wrap">
            <a
              href="https://www.google.com/search?q=univers+instrument+service"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white px-1.5 py-1 sm:px-4 sm:py-2 rounded-lg shadow-sm border-2 border-transparent hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 mr-1.5 sm:mr-2" viewBox="0 0 24 24">
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
              <div className="text-left">
                <div className="flex items-center">
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">4.9</span>
                  <div className="flex ml-1 sm:ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">{t.testimonials.googleReviews}</p>
              </div>
            </a>

            <div className="hidden md:flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-semibold">{t.testimonials.title} <span className="text-secondary">{t.testimonials.titleHighlight}</span></span>
              </div>
            </div>

            <a
              href="https://www.tripadvisor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white px-1.5 py-1 sm:px-4 sm:py-2 rounded-lg shadow-sm border-2 border-transparent hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <Image
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tripadvisor-icon.png"
                alt="TripAdvisor"
                width={24}
                height={24}
                className="w-4 h-4 sm:w-6 sm:h-6 mr-1.5 sm:mr-2"
              />
              <div className="text-left">
                <div className="flex items-center">
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">5.0</span>
                  <div className="flex ml-1 sm:ml-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 mx-0.5"></div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">{t.testimonials.tripAdvisor}</p>
              </div>
            </a>
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
                <div className="px-2 py-2 flex flex-col h-full">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full flex flex-col border border-gray-100">
                    {/* Platform Badge */}
                    <div className="flex items-center justify-between mb-4">
                      {t.platform === "google" ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                          <span className="text-sm font-medium text-gray-700">Google</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Image
                            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tripadvisor-icon.png"
                            alt="TripAdvisor"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium text-gray-700">TripAdvisor</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">{t.date}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {t.platform === "google" ? (
                        <div className="flex">
                          {[...Array(t.rating)].map((_, idx) => (
                            <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      ) : (
                        <div className="flex">
                          {[...Array(t.rating)].map((_, idx) => (
                            <div key={idx} className="w-5 h-5 rounded-full bg-green-500 mx-0.5"></div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className="grow mb-4">
                      <p className="text-sm leading-relaxed text-gray-700">{t.text}</p>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center pt-4 border-t border-gray-100">
                      <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 relative">
                        <Image
                          src={t.image || "/placeholder.svg"}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                          onError={(e) => {
                            // Removing error handler as next/image handles placeholders differently, 
                            // but for now keeping it simple or relying on fallback logic if we could.
                            // Basic error handling isn't directly supported on Image component in the same way for src replacement.
                            // We heavily rely on the src being correct or the placeholder.
                          }}
                        />
                      </div>
                      <div className="grow">
                        <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                        <p className="text-gray-500 text-xs">{t.location}</p>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="text-xs">{t.helpful}</span>
                      </div>
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
