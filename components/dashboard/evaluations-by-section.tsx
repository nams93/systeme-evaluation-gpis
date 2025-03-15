"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEvaluations } from "@/services/supabase-service"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EvaluationsBySectionProps {
  className?: string
}

type SectionData = {
  section: string
  count: number
  averageScore: number
}

export function EvaluationsBySection({ className }: EvaluationsBySectionProps) {
  const [sectionData, setSectionData] = useState<SectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const evaluations = await getAllEvaluations()

        // Regrouper les évaluations par section
        const sectionMap = new Map<string, { count: number; totalScore: number }>()

        evaluations.forEach((item) => {
          const section = item.section || "Non spécifiée"
          const sectionInfo = sectionMap.get(section) || { count: 0, totalScore: 0 }

          sectionMap.set(section, {
            count: sectionInfo.count + 1,
            totalScore: sectionInfo.totalScore + (item.score || 0),
          })
        })

        // Convertir la Map en tableau pour l'affichage
        const sectionArray: SectionData[] = Array.from(sectionMap.entries()).map(([section, data]) => ({
          section: getSectionLabel(section),
          count: data.count,
          averageScore: data.count > 0 ? Number.parseFloat((data.totalScore / data.count).toFixed(1)) : 0,
        }))

        // Trier par nombre d'évaluations (décroissant)
        sectionArray.sort((a, b) => b.count - a.count)

        setSectionData(sectionArray)
      } catch (error) {
        console.error("Erreur lors du chargement des données par section:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  function getSectionLabel(section: string): string {
    switch (section) {
      case "1":
        return "Section 1"
      case "2":
        return "Section 2"
      case "3":
        return "Section 3"
      case "4":
        return "Section 4"
      case "vap":
        return "Section VAP"
      default:
        return section
    }
  }

  function getProgressColor(score: number): string {
    if (score >= 3.5) return "bg-green-500"
    if (score >= 2.5) return "bg-blue-500"
    if (score >= 1.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Évaluations par section</CardTitle>
          <CardDescription>Répartition et scores moyens</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[250px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Évaluations par section</CardTitle>
        <CardDescription>Répartition et scores moyens</CardDescription>
      </CardHeader>
      <CardContent>
        {sectionData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sectionData.map((data) => (
              <div key={data.section} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{data.section}</div>
                  <div className="text-sm text-muted-foreground">{data.count} évaluations</div>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(data.averageScore)}`}
                    style={{ width: `${(data.averageScore / 4) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-right">
                  Score moyen: <span className="font-medium">{data.averageScore}/4</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

