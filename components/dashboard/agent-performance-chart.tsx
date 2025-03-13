"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AgentPerformanceChartProps {
  agent: string
  evaluations: any[]
}

export function AgentPerformanceChart({ agent, evaluations }: AgentPerformanceChartProps) {
  // Trier les évaluations par date
  const sortedEvaluations = useMemo(() => {
    return [...evaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [evaluations])

  // Données pour le graphique radar des compétences
  const radarData = useMemo(() => {
    if (evaluations.length === 0) return []

    // Prendre la dernière évaluation
    const latestEval = sortedEvaluations[sortedEvaluations.length - 1]

    return [
      { subject: "Connaissances Juridiques", value: Number(latestEval.connaissances_juridiques) },
      { subject: "Connaissance Structure", value: Number(latestEval.connaissance_structure) },
      { subject: "Connaissance Patrimoine", value: Number(latestEval.connaissance_patrimoine) },
      { subject: "Transmissions", value: Number(latestEval.transmissions) },
      { subject: "Vigilance", value: Number(latestEval.vigilance) },
      { subject: "Gestion du Stress", value: Number(latestEval.stress) },
    ]
  }, [sortedEvaluations])

  // Données pour le graphique d'évolution des moyennes
  const progressData = useMemo(() => {
    return sortedEvaluations.map((eval) => ({
      date: eval.date,
      "Savoirs et Connaissances": Number(eval.savoirsConnaissances),
      "Savoirs-Faire": Number(eval.savoirsFaire),
      "Moyenne Générale": Number(eval.moyenneGenerale),
    }))
  }, [sortedEvaluations])

  return (
    <Tabs defaultValue="radar" className="space-y-4">
      <TabsList>
        <TabsTrigger value="radar">Profil de compétences</TabsTrigger>
        <TabsTrigger value="progress">Évolution</TabsTrigger>
      </TabsList>

      <TabsContent value="radar">
        <Card>
          <CardHeader>
            <CardTitle>Profil de compétences actuel</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                value: { label: "Niveau", color: "hsl(var(--chart-1))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 4]} />
                  <Radar
                    name="Niveau"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des performances</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                "Savoirs et Connaissances": { label: "Savoirs et Connaissances", color: "hsl(var(--chart-1))" },
                "Savoirs-Faire": { label: "Savoirs-Faire", color: "hsl(var(--chart-2))" },
                "Moyenne Générale": { label: "Moyenne Générale", color: "hsl(var(--chart-3))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 4]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Savoirs et Connaissances"
                    stroke="var(--color-Savoirs et Connaissances)"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Savoirs-Faire"
                    stroke="var(--color-Savoirs-Faire)"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Moyenne Générale"
                    stroke="var(--color-Moyenne Générale)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

