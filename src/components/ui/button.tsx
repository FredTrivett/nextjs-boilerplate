"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-medium",
  {
    variants: {
      variant: {
        primary: [
          "bg-zinc-800/80 backdrop-blur-sm border border-white/10",
          "hover:bg-zinc-900/95 hover:border-white/20",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-white shadow-lg",
          "group",
          "px-6",
        ].join(" "),
        ghost: [
          "bg-zinc-950/90 overflow-hidden border border-zinc-900",
          "group",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-white",
          "px-6",
        ].join(" "),
        secondary: [
          "bg-transparent backdrop-blur-sm",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-white/80 hover:text-white",
          "group",
          "px-0",
        ].join(" "),
        danger: [
          "bg-red-500/10 backdrop-blur-sm border border-red-500/20",
          "hover:bg-red-500/20 hover:border-red-500/30",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-white shadow-lg",
          "group",
          "px-6",
          "transform-none",
        ].join(" "),
        outline: [
          "bg-zinc-900/80 backdrop-blur-sm border border-zinc-700",
          "hover:bg-zinc-900/90 hover:border-zinc-600",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-white shadow-lg",
          "group",
          "px-0",
        ].join(" "),
      },
      size: {
        default: "h-11 py-2 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-9 w-9",
        none: "text-sm",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent blur-md" />
        </div>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
