"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEvaluations, getAgents, getEvaluateurs } from "@/services/supabase-service"
import { Loader2, Users, ClipboardCheck, Star, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    totalAgents: 0,
    totalEvaluateurs: 0,
    averageScore: 0,
    recentProgress: 0,
    isLoading: true,
    sectionData: [] as { name: string; score: number; count: number }[],
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [evaluations, agents, evaluateurs] = await Promise.all([
          getAllEvaluations(),
          getAgents(),
          getEvaluateurs(),
        ])

        // Calculer le score moyen
        const totalScore = evaluations.reduce((sum, item) => sum + (item.score || 0), 0)
        const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0

        // Calculer la progression récente (derniers 30 jours vs période précédente)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Remplacé "eval" par "item" pour éviter le mot réservé
        const recentEvals = evaluations.filter((item) => new Date(item.date) >= thirtyDaysAgo)
        const recentAvg =
          recentEvals.length > 0
            ? recentEvals.reduce((sum, item) => sum + (item.score || 0), 0) / recentEvals.length
            : 0

        // Remplacé "eval" par "item" pour éviter le mot réservé
        const previousEvals = evaluations.filter(
          (item) =>
            new Date(item.date) < thirtyDaysAgo &&
            new Date(item.date) >= new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        )
        const previousAvg =
          previousEvals.length > 0
            ? previousEvals.reduce((sum, item) => sum + (item.score || 0), 0) / previousEvals.length
            : 0

        const progressPercentage = previousAvg === 0 ? 0 : ((recentAvg - previousAvg) / previousAvg) * 100

        // Données par section pour le graphique
        const sectionMap = new Map<string, { score: number; count: number }>()

        evaluations.forEach((item) => {
          const section = item.section || "Non spécifiée"
          const sectionInfo = sectionMap.get(section) || { score: 0, count: 0 }

          sectionMap.set(section, {
            score: sectionInfo.score + (item.score || 0),
            count: sectionInfo.count + 1,
          })
        })

        const sectionData = Array.from(sectionMap.entries()).map(([section, data]) => ({
          name: getSectionLabel(section),
          score: data.count > 0 ? Number((data.score / data.count).toFixed(2)) : 0,
          count: data.count,
        }))

        setStats({
          totalEvaluations: evaluations.length,
          totalAgents: agents.length,
          totalEvaluateurs: evaluateurs.length,
          averageScore: Number(averageScore.toFixed(2)),
          recentProgress: Number(progressPercentage.toFixed(1)),
          isLoading: false,
          sectionData,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    fetchStats()
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

  if (stats.isLoading) {
    return (
      <div className="flex justify-center items-center h-[120px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des évaluations</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">Évaluations enregistrées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents évalués</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">Agents dans la base de données</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}/4</div>
            <p className="text-xs text-muted-foreground">Moyenne générale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression récente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.recentProgress > 0 ? "text-green-600" : stats.recentProgress < 0 ? "text-red-600" : ""}`}
            >
              {stats.recentProgress > 0 ? "+" : ""}
              {stats.recentProgress}%
            </div>
            <p className="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des scores par section au lieu du graphique */}
      <Card>
        <CardHeader>
          <CardTitle>Scores moyens par section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Section</th>
                  <th className="text-left py-2">Score moyen</th>
                  <th className="text-left py-2">Nombre d'évaluations</th>
                </tr>
              </thead>
              <tbody>
                {stats.sectionData.map((section) => (
                  <tr key={section.name} className="border-b">
                    <td className="py-2">{section.name}</td>
                    <td className="py-2">{section.score}/4</td>
                    <td className="py-2">{section.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

