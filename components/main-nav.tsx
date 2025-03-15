"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <div className="mr-4 flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <DashboardNav />
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-center">
        <span className="font-bold text-xl">GPIS Évaluation</span>
      </Link>
    </div>
  )
}

