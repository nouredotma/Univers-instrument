import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return <Component className={cn("container mx-auto px-2 sm:px-4", className)}>{children}</Component>
}
