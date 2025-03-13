"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart2, FileText, Home, Settings, Users } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Accueil",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Évaluation",
      href: "/evaluation",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Rapports",
      href: "/reports",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Paramètres",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Button variant={pathname === item.href ? "default" : "ghost"} className="h-9">
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

