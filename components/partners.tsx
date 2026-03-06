"use client"

import { animate, motion, useMotionValue } from 'framer-motion';
import React, { CSSProperties, useEffect, useState } from 'react';
import useMeasure from '@/lib/hooks/use-measure';
import Link from "next/link"
import Image from "next/image"
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "@/components/ui/container";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    speed?: number;
    speedOnHover?: number;
    direction?: 'horizontal' | 'vertical';
    reverse?: boolean;
    className?: string;
};

function InfiniteSlider({
    children,
    gap = 16,
    speed = 100,
    speedOnHover,
    direction = 'horizontal',
    reverse = false,
    className,
}: InfiniteSliderProps) {
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        let controls: any;
        const size = direction === 'horizontal' ? width : height;
        if (size === 0) return;

        const contentSize = size + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;

        const distanceToTravel = Math.abs(to - from);
        const duration = distanceToTravel / currentSpeed;

        if (isTransitioning) {
            const remainingDistance = Math.abs(translation.get() - to);
            const transitionDuration = remainingDistance / currentSpeed;
            controls = animate(translation, [translation.get(), to], {
                ease: 'linear',
                duration: transitionDuration,
                onComplete: () => {
                    setIsTransitioning(false);
                    setKey((prevKey) => prevKey + 1);
                },
            });
        } else {
            controls = animate(translation, [from, to], {
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
                onRepeat: () => {
                    translation.set(from);
                },
            });
        }

        return () => controls?.stop();
    }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse]);

    const hoverProps = speedOnHover
        ? {
              onHoverStart: () => {
                  setIsTransitioning(true);
                  setCurrentSpeed(speedOnHover);
              },
              onHoverEnd: () => {
                  setIsTransitioning(true);
                  setCurrentSpeed(speed);
              },
          }
        : {};

    return (
        <div className={cn('overflow-hidden', className)}>
            <motion.div
                className="flex w-max"
                style={{
                    ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
                    gap: `${gap}px`,
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
                // @ts-ignore - Custom hook ref type mismatch with motion.div ref
                ref={ref}
                {...hoverProps}>
                {children}
                {children}
            </motion.div>
        </div>
    );
}

type BlurredInfiniteSliderProps = InfiniteSliderProps & {
    fadeWidth?: number;
    containerClassName?: string;
};

function BlurredInfiniteSlider({
    children,
    fadeWidth = 80,
    containerClassName,
    ...sliderProps
}: BlurredInfiniteSliderProps) {

    const maskStyle: CSSProperties = {
        maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
        WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    };

    return (
        <div
            className={cn('relative w-full', containerClassName)}
            style={maskStyle}
        >
            <InfiniteSlider {...sliderProps}>{children}</InfiniteSlider>
        </div>
    );
}

const PARTNER_LOGOS = [
  {
    src: "https://th.bing.com/th/id/OADD2.8108982943622_1JLMIX77UXV5TKOYDU?w=32&h=32&o=6&cb=ucfimg1&pid=21.2&ucfimg=1",
    alt: "Viator",
    height: 32,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/02/TripAdvisor_Logo.svg",
    alt: "TripAdvisor",
    height: 32,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Booking.com_Logo.svg",
    alt: "Booking.com",
    height: 28,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Expedia_Logo_2023.svg",
    alt: "Expedia",
    height: 28,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
    alt: "Airbnb",
    height: 32,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e2/GetYourGuide_logo.svg",
    alt: "GetYourGuide",
    height: 32,
  },
];


import { useLanguage } from "@/components/language-provider";

export default function Partners() {
    const { t } = useLanguage();
    const [computedGap, setComputedGap] = useState<number>(80);

    useEffect(() => {
        const calc = () => {
            // match Tailwind's `md` breakpoint (768px)
            setComputedGap(window.innerWidth < 768 ? 32 : 80);
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    return (
        <section className="bg-gray-50 py-8 w-full">
            <Container className="max-w-7xl mx-auto px-2 md:px-6">
                <div className="flex flex-col items-center md:flex-row gap-8">
                    <div className="shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-gray-200 md:pr-6">
                        <p className="text-lg font-trajan-pro tracking-widest text-primary font-bold">
                            {t.partners?.title || "OUR PARTNERS"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {t.partners?.description || "Trusted by industry leaders"}
                        </p>
                    </div>
                    <div className="w-full py-6 md:w-auto md:flex-1 min-w-0">
                                                <BlurredInfiniteSlider
                                                        speedOnHover={20}
                                                        speed={40}
                                                        gap={computedGap}
                                                        fadeWidth={80}
                                                >
                            {PARTNER_LOGOS.map((logo, index) => (
                                                                <div key={index} className="flex items-center justify-center min-w-20 md:min-w-[120px] h-12 md:h-16 px-2 md:px-4 relative group/logo">
                                                                    <div className="relative h-6 w-20 md:h-8 md:w-24">
                                                                        <Image
                                                                            src={logo.src}
                                                                            alt={logo.alt}
                                                                            fill
                                                                            className="object-contain"
                                                                            sizes="96px"
                                                                        />
                                  </div>
                                </div>
                            ))}
                        </BlurredInfiniteSlider>
                    </div>
                </div>
            </Container>
        </section>
    );
}
