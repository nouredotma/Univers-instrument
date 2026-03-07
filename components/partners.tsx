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
    src: "/p1.png",
    alt: "Atago",
  },
  {
    src: "/p2.jpeg",
    alt: "Testo",
  },
  {
    src: "/p3.png",
    alt: "Merck",
  },
  {
    src: "/p4.jpeg",
    alt: "Palintest",
  },
  {
    src: "/p5.jpeg",
    alt: "Ika",
  },
];


import { useLanguage } from "@/components/language-provider";

export default function Partners() {
    const { t } = useLanguage();
    const [computedGap, setComputedGap] = useState<number>(40);

    useEffect(() => {
        const calc = () => {
            // match Tailwind's `md` breakpoint (768px)
            setComputedGap(window.innerWidth < 768 ? 40 : 80);
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    return (
        <section className="bg-white py-2 w-full">
            <Container className="max-w-full mx-auto px-4 md:px-12">
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
                                                                 <div key={index} className="flex items-center justify-center h-12 md:h-16 px-0 relative group/logo w-20 md:w-28">
                                                                        <Image
                                                                            src={logo.src}
                                                                            alt={logo.alt}
                                                                            fill
                                                                            className="object-contain"
                                                                            sizes="(max-width: 768px) 80px, 112px"
                                                                        />
                                                                </div>
                            ))}
                        </BlurredInfiniteSlider>
                    </div>
                </div>
            </Container>
        </section>
    );
}
