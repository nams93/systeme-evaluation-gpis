"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEvaluations, getAgents } from "@/services/supabase-service"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface RecentEvaluationsProps {
  className?: string
}

type Agent = {
  id: string
  nom: string
  prenom: string
  matricule: string
}

type Evaluation = {
  id: number
  agent_id: string
  date: string
  section: string
  indicatif: string
  contexte: string
  score: number
  status: string
}

export function RecentEvaluations({ className }: RecentEvaluationsProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [agents, setAgents] = useState<Record<string, Agent>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [evaluationsData, agentsData] = await Promise.all([getAllEvaluations(), getAgents()])

        // Créer un dictionnaire d'agents pour un accès rapide
        const agentsDict = agentsData.reduce(
          (acc, agent) => {
            acc[agent.id] = agent
            return acc
          },
          {} as Record<string, Agent>,
        )

        setEvaluations(evaluationsData)
        setAgents(agentsDict)
      } catch (error) {
        console.error("Erreur lors du chargement des évaluations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrer les évaluations en fonction du terme de recherche
  const filteredEvaluations = evaluations.filter((item) => {
    const agent = agents[item.agent_id]
    if (!agent) return false

    const searchString =
      `${agent.nom} ${agent.prenom} ${agent.matricule} ${item.indicatif} ${item.contexte}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  // Trier les évaluations par date (les plus récentes d'abord)
  const sortedEvaluations = [...filteredEvaluations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Limiter à 10 évaluations

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR").format(date)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completee":
        return "bg-green-500"
      case "en_cours":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Évaluations récentes</CardTitle>
          <CardDescription>Les 10 dernières évaluations</CardDescription>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Évaluations récentes</CardTitle>
            <CardDescription>Les 10 dernières évaluations</CardDescription>
          </div>
          <div className="relative w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedEvaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-muted-foreground mb-4">Aucune évaluation trouvée</p>
            <Button asChild>
              <Link href="/evaluation/nouvelle">Créer une évaluation</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvaluations.map((item) => {
              const agent = agents[item.agent_id]
              return (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">
                      {agent ? `${agent.prenom} ${agent.nom}` : "Agent inconnu"}
                      {agent && agent.matricule && ` (${agent.matricule})`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.contexte} - {formatDate(item.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {item.score}/4
                    </Badge>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

