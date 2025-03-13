"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function AgentComparison() {
  const [agents, setAgents] = useState<string[]>([])
  const [selectedAgent1, setSelectedAgent1] = useState<string>("")
  const [selectedAgent2, setSelectedAgent2] = useState<string>("")
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Récupérer la liste des agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const evalsRef = collection(db, "evaluations")
        const snapshot = await getDocs(evalsRef)

        const uniqueAgents = [...new Set(snapshot.docs.map((doc) => doc.data().agent))]
        setAgents(uniqueAgents)

        if (uniqueAgents.length > 0) {
          setSelectedAgent1(uniqueAgents[0])
          if (uniqueAgents.length > 1) {
            setSelectedAgent2(uniqueAgents[1])
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  // Récupérer les données de comparaison lorsque les agents sélectionnés changent
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!selectedAgent1 || !selectedAgent2) return

      try {
        setLoading(true)

        // Récupérer les dernières évaluations des deux agents
        const fetchAgentData = async (agentName: string) => {
          const evalsRef = collection(db, "evaluations")
          const q = query(evalsRef, where("agent", "==", agentName))
          const snapshot = await getDocs(q)

          if (snapshot.empty) return null

          // Trier par date et prendre la plus récente
          const sortedDocs = snapshot.docs.sort((a, b) => {
            const dateA = new Date(a.data().date).getTime()
            const dateB = new Date(b.data().date).getTime()
            return dateB - dateA
          })

          return sortedDocs[0].data()
        }

        const agent1Data = await fetchAgentData(selectedAgent1)
        const agent2Data = await fetchAgentData(selectedAgent2)

        if (agent1Data && agent2Data) {
          // Créer les données pour le graphique radar
          const comparisonFields = [
            { name: "Connaissances Juridiques", field: "connaissances_juridiques" },
            { name: "Connaissance Structure", field: "connaissance_structure" },
            { name: "Connaissance Patrimoine", field: "connaissance_patrimoine" },
            { name: "Transmissions", field: "transmissions" },
            { name: "Vigilance", field: "vigilance" },
            { name: "Déplacement", field: "deplacement" },
            { name: "Distances", field: "distances" },
            { name: "Positionnement", field: "positionnement" },
            { name: "Contact", field: "contact" },
            { name: "Stress", field: "stress" },
            { name: "Participation", field: "participation" },
          ]

          const data = comparisonFields.map((field) => ({
            subject: field.name,
            [selectedAgent1]: Number(agent1Data[field.field]) || 0,
            [selectedAgent2]: Number(agent2Data[field.field]) || 0,
          }))

          setComparisonData(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de comparaison:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComparisonData()
  }, [selectedAgent1, selectedAgent2])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison d'agents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="agent1">Premier agent</Label>
            <Select value={selectedAgent1} onValueChange={setSelectedAgent1}>
              <SelectTrigger id="agent1">
                <SelectValue placeholder="Sélectionner un agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={`agent1-${agent}`} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent2">Second agent</Label>
            <Select value={selectedAgent2} onValueChange={setSelectedAgent2}>
              <SelectTrigger id="agent2">
                <SelectValue placeholder="Sélectionner un agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={`agent2-${agent}`} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : comparisonData.length > 0 ? (
          <ChartContainer
            config={{
              [selectedAgent1]: { label: selectedAgent1, color: "hsl(var(--chart-1))" },
              [selectedAgent2]: { label: selectedAgent2, color: "hsl(var(--chart-2))" },
            }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 4]} />
                <Radar
                  name={selectedAgent1}
                  dataKey={selectedAgent1}
                  stroke={`var(--color-${selectedAgent1})`}
                  fill={`var(--color-${selectedAgent1})`}
                  fillOpacity={0.5}
                />
                <Radar
                  name={selectedAgent2}
                  dataKey={selectedAgent2}
                  stroke={`var(--color-${selectedAgent2})`}
                  fill={`var(--color-${selectedAgent2})`}
                  fillOpacity={0.5}
                />
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center h-80 text-muted-foreground">
            Sélectionnez deux agents pour afficher la comparaison
          </div>
        )}
      </CardContent>
    </Card>
  )
}

