"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface RatingButtonsProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function RatingButtons({ value, onChange, className }: RatingButtonsProps) {
  return (
    <div className={cn("flex justify-between gap-2", className)}>
      {[0, 1, 2, 3, 4].map((rating) => (
        <Button
          key={rating}
          variant={value === rating ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-1 h-12 transition-all",
            value === rating && "ring-2 ring-primary ring-offset-2",
            rating === 0 && "bg-muted hover:bg-muted/80",
          )}
          onClick={() => onChange(rating)}
        >
          {rating}
        </Button>
      ))}
    </div>
  )
}

