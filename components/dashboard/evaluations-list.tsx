"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEvaluations, getAgents, getEvaluateurs } from "@/services/supabase-service"
import { Loader2, Search, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Agent = {
  id: string
  nom: string
  prenom: string
  matricule: string
}

type Evaluateur = {
  id: string
  nom: string
  prenom: string
  fonction?: string
}

type Evaluation = {
  id: number
  agent_id: string
  evaluateur_id: string
  date: string
  section: string
  indicatif: string
  contexte: string
  score: number
  status: string
}

export function EvaluationsList() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [agents, setAgents] = useState<Record<string, Agent>>({})
  const [evaluateurs, setEvaluateurs] = useState<Record<string, Evaluateur>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Filtres et tri
  const [searchTerm, setSearchTerm] = useState("")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        const [evaluationsData, agentsData, evaluateursData] = await Promise.all([
          getAllEvaluations(),
          getAgents(),
          getEvaluateurs(),
        ])

        // Créer des dictionnaires pour un accès rapide
        const agentsDict = agentsData.reduce(
          (acc, agent) => {
            acc[agent.id] = agent
            return acc
          },
          {} as Record<string, Agent>,
        )

        const evaluateursDict = evaluateursData.reduce(
          (acc, evaluateur) => {
            acc[evaluateur.id] = evaluateur
            return acc
          },
          {} as Record<string, Evaluateur>,
        )

        setEvaluations(evaluationsData)
        setAgents(agentsDict)
        setEvaluateurs(evaluateursDict)
      } catch (error) {
        console.error("Erreur lors du chargement des évaluations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrer les évaluations
  const filteredEvaluations = evaluations.filter((eval) => {
    // Filtre par section
    if (sectionFilter !== "all" && eval.section !== sectionFilter) {
      return false
    }

    // Filtre par terme de recherche
    const agent = agents[eval.agent_id]
    const evaluateur = evaluateurs[eval.evaluateur_id]

    if (!agent) return false

    const searchString = `
      ${agent.nom} ${agent.prenom} ${agent.matricule} 
      ${evaluateur ? `${evaluateur.nom} ${evaluateur.prenom}` : ""} 
      ${eval.indicatif} ${eval.contexte}
    `.toLowerCase()

    return searchString.includes(searchTerm.toLowerCase())
  })

  // Trier les évaluations
  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "agent":
        const agentA = agents[a.agent_id]
        const agentB = agents[b.agent_id]
        comparison =
          agentA && agentB ? `${agentA.nom} ${agentA.prenom}`.localeCompare(`${agentB.nom} ${agentB.prenom}`) : 0
        break
      case "score":
        comparison = a.score - b.score
        break
      default:
        comparison = 0
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedEvaluations.length / itemsPerPage)
  const paginatedEvaluations = sortedEvaluations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des évaluations</CardTitle>
          <CardDescription>Toutes les évaluations GPIS</CardDescription>
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
        <CardTitle>Liste des évaluations</CardTitle>
        <CardDescription>Toutes les évaluations GPIS</CardDescription>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
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
        {paginatedEvaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-muted-foreground mb-4">Aucune évaluation trouvée</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-5 flex items-center">
                  <Button variant="ghost" size="sm" className="p-0 font-medium" onClick={() => toggleSort("agent")}>
                    Agent
                    {sortField === "agent" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </div>
                <div className="col-span-2 flex items-center">
                  <Button variant="ghost" size="sm" className="p-0 font-medium" onClick={() => toggleSort("date")}>
                    Date
                    {sortField === "date" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </div>
                <div className="col-span-3">Contexte</div>
                <div className="col-span-2 flex items-center justify-end">
                  <Button variant="ghost" size="sm" className="p-0 font-medium" onClick={() => toggleSort("score")}>
                    Score
                    {sortField === "score" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </div>
              </div>

              {paginatedEvaluations.map((item) => {
                const agent = agents[item.agent_id]
                const evaluateur = evaluateurs[item.evaluateur_id]

                return (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-4 items-center border-b last:border-0">
                    <div className="col-span-5">
                      <div className="font-medium">
                        {agent ? `${agent.prenom} ${agent.nom}` : "Agent inconnu"}
                        {agent && agent.matricule && ` (${agent.matricule})`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Évaluateur: {evaluateur ? `${evaluateur.prenom} ${evaluateur.nom}` : "Inconnu"}
                      </div>
                    </div>
                    <div className="col-span-2">{formatDate(item.date)}</div>
                    <div className="col-span-3">
                      <div className="text-sm">{item.contexte}</div>
                      <div className="text-xs text-muted-foreground">{getSectionLabel(item.section)}</div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Badge variant="outline" className="font-medium">
                        {item.score}/4
                      </Badge>
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

