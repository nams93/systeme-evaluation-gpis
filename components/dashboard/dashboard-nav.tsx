"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
  },
  {
    title: "Évaluations",
    href: "/dashboard/evaluations",
  },
  {
    title: "Agents",
    href: "/dashboard/agents",
  },
  {
    title: "Rapports",
    href: "/dashboard/rapports",
  },
  {
    title: "Statistiques",
    href: "/dashboard/statistiques",
  },
  {
    title: "Paramètres",
    href: "/dashboard/parametres",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "transparent",
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  )
}

