import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#2D4A3E] text-white hover:bg-[#3D5A4E]',
        secondary: 'border-transparent bg-[#E8EBE4] text-[#2D4A3E] hover:bg-[#D4C9B8]',
        destructive: 'border-transparent bg-[#A65A52] text-white hover:bg-[#96504A]',
        outline: 'text-[#2D4A3E] border-[#D4C9B8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
