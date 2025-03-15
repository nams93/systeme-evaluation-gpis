"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, Users, BarChart, Settings, LogOut } from "lucide-react"

const navItems = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Évaluations",
    href: "/dashboard/evaluations",
    icon: ClipboardList,
  },
  {
    title: "Agents",
    href: "/dashboard/agents",
    icon: Users,
  },
  {
    title: "Statistiques",
    href: "/dashboard/statistiques",
    icon: BarChart,
  },
  {
    title: "Paramètres",
    href: "/dashboard/parametres",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          className={cn("justify-start", pathname === item.href && "bg-primary text-primary-foreground")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}

      <form action="/auth/signout" method="POST" className="mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          type="submit"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </form>
    </nav>
  )
}

