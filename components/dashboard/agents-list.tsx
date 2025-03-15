"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEvaluations, getAgents } from "@/services/supabase-service"
import { Loader2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Agent = {
  id: string
  nom: string
  prenom: string
  matricule: string
  equipe?: string
  poste?: string
}

type AgentWithStats = Agent & {
  evaluationCount: number
  averageScore: number
  lastEvaluationDate: string | null
}

export function AgentsList() {
  const [agents, setAgents] = useState<AgentWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectionFilter, setSectionFilter] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsData, evaluationsData] = await Promise.all([getAgents(), getAllEvaluations()])

        // Calculer les statistiques pour chaque agent
        const agentsWithStats: AgentWithStats[] = agentsData.map((agent) => {
          const agentEvaluations = evaluationsData.filter((item) => item.agent_id === agent.id)

          // Calculer le score moyen
          const totalScore = agentEvaluations.reduce((sum, item) => sum + (item.score || 0), 0)
          const averageScore = agentEvaluations.length > 0 ? totalScore / agentEvaluations.length : 0

          // Trouver la date de la dernière évaluation
          const sortedEvals = [...agentEvaluations].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          const lastEvaluationDate = sortedEvals.length > 0 ? sortedEvals[0].date : null

          return {
            ...agent,
            evaluationCount: agentEvaluations.length,
            averageScore: Number(averageScore.toFixed(2)),
            lastEvaluationDate,
          }
        })

        setAgents(agentsWithStats)
      } catch (error) {
        console.error("Erreur lors du chargement des agents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrer les agents
  const filteredAgents = agents.filter((agent) => {
    // Filtre par section/équipe
    if (sectionFilter !== "all" && agent.equipe !== `Section ${sectionFilter}`) {
      return false
    }

    // Filtre par terme de recherche
    const searchString = `${agent.nom} ${agent.prenom} ${agent.matricule || ""}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  function formatDate(dateString: string | null) {
    if (!dateString) return "Jamais évalué"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR").format(date)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des agents</CardTitle>
          <CardDescription>Suivi des performances des agents</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des agents</CardTitle>
        <CardDescription>Suivi des performances des agents</CardDescription>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un agent..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="w-[180px]">
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Toutes les sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sections</SelectItem>
                  <SelectItem value="1">Section 1</SelectItem>
                  <SelectItem value="2">Section 2</SelectItem>
                  <SelectItem value="3">Section 3</SelectItem>
                  <SelectItem value="4">Section 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-muted-foreground mb-4">Aucun agent trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Agent</th>
                  <th className="text-left py-2">Évaluations</th>
                  <th className="text-left py-2">Dernière évaluation</th>
                  <th className="text-left py-2">Score moyen</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b">
                    <td className="py-2">
                      <div className="font-medium">
                        {agent.prenom} {agent.nom}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agent.matricule && `Matricule: ${agent.matricule}`}
                        {agent.equipe && ` • ${agent.equipe}`}
                      </div>
                    </td>
                    <td className="py-2">{agent.evaluationCount}</td>
                    <td className="py-2">{formatDate(agent.lastEvaluationDate)}</td>
                    <td className="py-2">{agent.averageScore}/4</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

