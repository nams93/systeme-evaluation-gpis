"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  // Ces données seraient normalement chargées depuis une API
  const stats = [
    {
      title: "Total des évaluations",
      value: "2,345",
      description: "+20.1% par rapport au mois dernier",
    },
    {
      title: "Évaluations en cours",
      value: "85",
      description: "12 à compléter aujourd'hui",
    },
    {
      title: "Score moyen",
      value: "7.2/10",
      description: "+0.3 par rapport au trimestre précédent",
    },
    {
      title: "Agents évalués",
      value: "573",
      description: "92% des agents actifs",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatsCard key={i} title={stat.title} value={stat.value} description={stat.description} />
      ))}
    </div>
  )
}

