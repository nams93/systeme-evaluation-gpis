"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
import { ChevronLeft, Download, FileText, Search, User, Users, BarChart2 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataTable } from "@/components/dashboard/data-table"
import { StatCard } from "@/components/dashboard/stat-card"
import { exportToPDF, exportToCSV } from "@/lib/export-utils"
// Ajouter l'import pour le widget de rapport rapide
import { QuickReportWidget } from "@/components/dashboard/quick-report-widget"

export default function Dashboard() {
  const [evaluations, setEvaluations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSection, setFilterSection] = useState("all")
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "evaluations"))
        const evaluationsData = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()

          // Calculer les moyennes
          const savoirsConnaissances = [
            Number(data.connaissances_juridiques) || 0,
            Number(data.connaissance_structure) || 0,
            Number(data.connaissance_patrimoine) || 0,
          ]

          const savoirsFaire = [
            Number(data.transmissions) || 0,
            Number(data.vigilance) || 0,
            Number(data.deplacement) || 0,
            Number(data.distances) || 0,
            Number(data.positionnement) || 0,
            Number(data.contact) || 0,
            Number(data.stress) || 0,
            Number(data.participation) || 0,
          ]

          const savoirsEtre = [
            Number(data.maitrise) || 0,
            Number(data.equipements) || 0,
            Number(data.tenue) || 0,
            Number(data.proprete) || 0,
            Number(data.vehicule) || 0,
            Number(data.comportement) || 0,
            Number(data.exemplarite) || 0,
            Number(data.motivation) || 0,
            Number(data.interaction) || 0,
            Number(data.hierarchie) || 0,
          ]

          const validSavoirsConnaissances = savoirsConnaissances.filter((score) => score > 0)
          const validSavoirsFaire = savoirsFaire.filter((score) => score > 0)
          const validSavoirsEtre = savoirsEtre.filter((score) => score > 0)

          const moyenneSavoirsConnaissances =
            validSavoirsConnaissances.length > 0
              ? (validSavoirsConnaissances.reduce((a, b) => a + b, 0) / validSavoirsConnaissances.length).toFixed(2)
              : "0"

          const moyenneSavoirsFaire =
            validSavoirsFaire.length > 0
              ? (validSavoirsFaire.reduce((a, b) => a + b, 0) / validSavoirsFaire.length).toFixed(2)
              : "0"

          const moyenneSavoirsEtre =
            validSavoirsEtre.length > 0
              ? (validSavoirsEtre.reduce((a, b) => a + b, 0) / validSavoirsEtre.length).toFixed(2)
              : "0"

          const allValidScores = [...validSavoirsConnaissances, ...validSavoirsFaire, ...validSavoirsEtre]
          const moyenneGenerale =
            allValidScores.length > 0
              ? (allValidScores.reduce((a, b) => a + b, 0) / allValidScores.length).toFixed(2)
              : "0"

          evaluationsData.push({
            id: doc.id,
            agent: data.nom_agent,
            date: data.date || new Date().toLocaleDateString(),
            section: data.section || "Non spécifiée",
            indicatif: data.indicatif || "Non spécifié",
            // Savoirs et Connaissances
            connaissances_juridiques: data.connaissances_juridiques || "0",
            connaissance_structure: data.connaissance_structure || "0",
            connaissance_patrimoine: data.connaissance_patrimoine || "0",
            // Savoirs-Faire
            transmissions: data.transmissions || "0",
            vigilance: data.vigilance || "0",
            deplacement: data.deplacement || "0",
            distances: data.distances || "0",
            positionnement: data.positionnement || "0",
            contact: data.contact || "0",
            stress: data.stress || "0",
            participation: data.participation || "0",
            // Savoirs-Être
            maitrise: data.maitrise || "0",
            equipements: data.equipements || "0",
            tenue: data.tenue || "0",
            proprete: data.proprete || "0",
            vehicule: data.vehicule || "0",
            comportement: data.comportement || "0",
            exemplarite: data.exemplarite || "0",
            motivation: data.motivation || "0",
            interaction: data.interaction || "0",
            hierarchie: data.hierarchie || "0",
            // Moyennes
            savoirsConnaissances: moyenneSavoirsConnaissances,
            savoirsFaire: moyenneSavoirsFaire,
            savoirsEtre: moyenneSavoirsEtre,
            moyenneGenerale,
            observation: data.observation || "",
          })
        })

        setEvaluations(evaluationsData)
      } catch (error) {
        console.error("Erreur lors de la récupération des évaluations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluations()
  }, [])

  // Filtrer les évaluations en fonction des critères de recherche
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => {
      const matchesSearch =
        searchTerm === "" ||
        evaluation.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.indicatif.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSection = filterSection === "all" || evaluation.section === filterSection

      return matchesSearch && matchesSection
    })
  }, [evaluations, searchTerm, filterSection])

  // Obtenir la liste des agents uniques
  const agents = useMemo(() => {
    const uniqueAgents = [...new Set(evaluations.map((evaluation) => evaluation.agent))]
    return uniqueAgents.map((agent) => {
      const agentEvals = evaluations.filter((evaluation) => evaluation.agent === agent)
      const avgScore =
        agentEvals.reduce((sum, evaluation) => sum + Number(evaluation.moyenneGenerale), 0) / agentEvals.length

      return {
        name: agent,
        evaluations: agentEvals.length,
        averageScore: avgScore.toFixed(2),
        lastEvaluation: new Date(
          Math.max(...agentEvals.map((item) => new Date(item.date).getTime())),
        ).toLocaleDateString(),
      }
    })
  }, [evaluations])

  // Obtenir la liste des sections uniques
  const sections = useMemo(() => {
    return [...new Set(evaluations.map((evaluation) => evaluation.section))].filter(Boolean)
  }, [evaluations])

  // Données pour le graphique radar des compétences
  const competencesData = useMemo(() => {
    if (evaluations.length === 0) return []

    const competences = {
      // Savoirs et Connaissances
      "Connaissances Juridiques": 0,
      "Connaissance Structure": 0,
      "Connaissance Patrimoine": 0,
      // Savoirs-Faire
      Transmissions: 0,
      Vigilance: 0,
      Déplacement: 0,
      Distances: 0,
      Positionnement: 0,
      Contact: 0,
      Stress: 0,
      Participation: 0,
      // Savoirs-Être
      Maîtrise: 0,
      Équipements: 0,
      Tenue: 0,
      Propreté: 0,
      Véhicule: 0,
      Comportement: 0,
      Exemplarité: 0,
      Motivation: 0,
      Interaction: 0,
      Hiérarchie: 0,
    }

    evaluations.forEach((evaluation) => {
      // Savoirs et Connaissances
      competences["Connaissances Juridiques"] += Number(evaluation.connaissances_juridiques) || 0
      competences["Connaissance Structure"] += Number(evaluation.connaissance_structure) || 0
      competences["Connaissance Patrimoine"] += Number(evaluation.connaissance_patrimoine) || 0
      // Savoirs-Faire
      competences["Transmissions"] += Number(evaluation.transmissions) || 0
      competences["Vigilance"] += Number(evaluation.vigilance) || 0
      competences["Déplacement"] += Number(evaluation.deplacement) || 0
      competences["Distances"] += Number(evaluation.distances) || 0
      competences["Positionnement"] += Number(evaluation.positionnement) || 0
      competences["Contact"] += Number(evaluation.contact) || 0
      competences["Stress"] += Number(evaluation.stress) || 0
      competences["Participation"] += Number(evaluation.participation) || 0
      // Savoirs-Être
      competences["Maîtrise"] += Number(evaluation.maitrise) || 0
      competences["Équipements"] += Number(evaluation.equipements) || 0
      competences["Tenue"] += Number(evaluation.tenue) || 0
      competences["Propreté"] += Number(evaluation.proprete) || 0
      competences["Véhicule"] += Number(evaluation.vehicule) || 0
      competences["Comportement"] += Number(evaluation.comportement) || 0
      competences["Exemplarité"] += Number(evaluation.exemplarite) || 0
      competences["Motivation"] += Number(evaluation.motivation) || 0
      competences["Interaction"] += Number(evaluation.interaction) || 0
      competences["Hiérarchie"] += Number(evaluation.hierarchie) || 0
    })

    // Calculer les moyennes
    Object.keys(competences).forEach((key) => {
      competences[key] = (competences[key] / evaluations.length).toFixed(2)
    })

    return Object.entries(competences).map(([name, value]) => ({
      subject: name,
      value: Number(value),
    }))
  }, [evaluations])

  // Données pour le graphique de répartition des notes
  const scoreDistribution = useMemo(() => {
    const distribution = [
      { name: "0-1", value: 0 },
      { name: "1-2", value: 0 },
      { name: "2-3", value: 0 },
      { name: "3-4", value: 0 },
    ]

    evaluations.forEach((evaluation) => {
      const score = Number(evaluation.moyenneGenerale)
      if (score < 1) distribution[0].value++
      else if (score < 2) distribution[1].value++
      else if (score < 3) distribution[2].value++
      else distribution[3].value++
    })

    return distribution
  }, [evaluations])

  // Données pour le graphique d'évolution des moyennes dans le temps
  const timeSeriesData = useMemo(() => {
    const sortedEvals = [...evaluations].sort((a, b) => new Date(a.date) - new Date(b.date))

    const monthlyData = {}

    sortedEvals.forEach((evaluation) => {
      const date = new Date(evaluation.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          date: monthYear,
          count: 0,
          totalScore: 0,
        }
      }

      monthlyData[monthYear].count++
      monthlyData[monthYear].totalScore += Number(evaluation.moyenneGenerale)
    })

    return Object.values(monthlyData).map((item) => ({
      date: item.date,
      Moyenne: Number.parseFloat((item.totalScore / item.count).toFixed(2)),
    }))
  }, [evaluations])

  // Gérer l'exportation des données
  const handleExportPDF = () => {
    try {
      exportToPDF(filteredEvaluations, "evaluations_agents")
    } catch (error) {
      console.error("Erreur lors de l'exportation en PDF:", error)
      // Afficher un message d'erreur à l'utilisateur
      alert("Une erreur s'est produite lors de l'exportation en PDF. Veuillez réessayer.")
    }
  }

  const handleExportCSV = () => {
    try {
      exportToCSV(filteredEvaluations, "evaluations_agents")
    } catch (error) {
      console.error("Erreur lors de l'exportation en CSV:", error)
      // Afficher un message d'erreur à l'utilisateur
      alert("Une erreur s'est produite lors de l'exportation en CSV. Veuillez réessayer.")
    }
  }

  // Afficher les détails d'un agent
  const handleViewAgentDetails = (agent) => {
    setSelectedAgent(agent)
  }

  // Revenir à la vue principale
  const handleBackToOverview = () => {
    setSelectedAgent(null)
  }

  // Colonnes pour le tableau des évaluations
  const evaluationColumns = [
    { header: "Date", accessorKey: "date" },
    { header: "Agent", accessorKey: "agent" },
    { header: "Section", accessorKey: "section" },
    { header: "Savoirs", accessorKey: "savoirsConnaissances" },
    { header: "Savoirs-Faire", accessorKey: "savoirsFaire" },
    { header: "Savoirs-Être", accessorKey: "savoirsEtre" },
    { header: "Moyenne", accessorKey: "moyenneGenerale" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewAgentDetails(agents.find((a) => a.name === row.original.agent))}
        >
          <User className="mr-2 h-4 w-4" />
          Détails
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Chargement des données..."
          text="Veuillez patienter pendant que nous récupérons les évaluations"
        />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Tableau de Bord des Évaluations"
        text="Visualisez et analysez les performances des agents"
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>
          <Link href="/evaluation">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nouvelle Évaluation
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      {selectedAgent ? (
        // Vue détaillée d'un agent
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToOverview}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportToPDF(
                    evaluations.filter((evaluation) => evaluation.agent === selectedAgent.name),
                    `evaluations_${selectedAgent.name.replace(/\s+/g, "_")}`,
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter en PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportToCSV(
                    evaluations.filter((evaluation) => evaluation.agent === selectedAgent.name),
                    `evaluations_${selectedAgent.name.replace(/\s+/g, "_")}`,
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter en CSV
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profil de {selectedAgent.name}</CardTitle>
              <CardDescription>
                Dernière évaluation: {selectedAgent.lastEvaluation} | Nombre d'évaluations: {selectedAgent.evaluations}{" "}
                | Score moyen: {selectedAgent.averageScore}/4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil de compétences</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer
                      config={{
                        value: { label: "Niveau", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={evaluations
                            .filter((evaluation) => evaluation.agent === selectedAgent.name)
                            .map(
                              (evaluation) =>
                                [
                                  { subject: "Participation mission", value: Number(evaluation.participation_mission) },
                                  { subject: "Attentif radio", value: Number(evaluation.attentif_radio) },
                                  { subject: "Anticipation", value: Number(evaluation.anticipation_directions) },
                                  { subject: "Vigilance", value: Number(evaluation.vigilance_environnement) },
                                  { subject: "Placements", value: Number(evaluation.placements_deplacements) },
                                  { subject: "Respect consignes", value: Number(evaluation.respect_consignes) },
                                  { subject: "Prise de contact", value: Number(evaluation.prise_contact) },
                                ][0],
                            )}
                        >
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

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des évaluations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={evaluations
                        .filter((evaluation) => evaluation.agent === selectedAgent.name)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))}
                      columns={[
                        { header: "Date", accessorKey: "date" },
                        { header: "Section", accessorKey: "section" },
                        { header: "Participation", accessorKey: "participation_mission" },
                        { header: "Radio", accessorKey: "attentif_radio" },
                        { header: "Anticipation", accessorKey: "anticipation_directions" },
                        { header: "Vigilance", accessorKey: "vigilance_environnement" },
                        { header: "Placements", accessorKey: "placements_deplacements" },
                        { header: "Consignes", accessorKey: "respect_consignes" },
                        { header: "Contact", accessorKey: "prise_contact" },
                        { header: "Moyenne", accessorKey: "moyenneGenerale" },
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Vue d'ensemble du tableau de bord
        <div className="grid gap-4">
          // Dans la section des statistiques du tableau de bord, ajouter le widget
          // Par exemple, dans la grille des widgets en haut du tableau de bord
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total des évaluations"
              value={evaluations.length}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Agents évalués"
              value={agents.length}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Moyenne générale"
              value={
                evaluations.length > 0
                  ? (
                      evaluations.reduce((sum, evaluation) => sum + Number(evaluation.moyenneGenerale || 0), 0) /
                      evaluations.length
                    ).toFixed(2)
                  : "N/A"
              }
              icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
            />
            <QuickReportWidget />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="search">Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nom d'agent..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select value={filterSection} onValueChange={setFilterSection}>
                      <SelectTrigger id="section">
                        <SelectValue placeholder="Toutes les sections" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les sections</SelectItem>
                        {sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button onClick={handleExportPDF} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en PDF
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="competences">Compétences</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Répartition des notes</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer
                      config={{
                        "0-1": { label: "0-1", color: "hsl(var(--chart-1))" },
                        "1-2": { label: "1-2", color: "hsl(var(--chart-2))" },
                        "2-3": { label: "2-3", color: "hsl(var(--chart-3))" },
                        "3-4": { label: "3-4", color: "hsl(var(--chart-4))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scoreDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Évolution des moyennes</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer
                      config={{
                        Moyenne: { label: "Moyenne", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 4]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="Moyenne" stroke="var(--color-Moyenne)" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Dernières évaluations</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={filteredEvaluations.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
                    columns={evaluationColumns}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance des agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={agents}
                    columns={[
                      { header: "Agent", accessorKey: "name" },
                      { header: "Évaluations", accessorKey: "evaluations" },
                      { header: "Score moyen", accessorKey: "averageScore" },
                      { header: "Dernière évaluation", accessorKey: "lastEvaluation" },
                      {
                        header: "Actions",
                        cell: ({ row }) => (
                          <Button variant="ghost" size="sm" onClick={() => handleViewAgentDetails(row.original)}>
                            <User className="mr-2 h-4 w-4" />
                            Détails
                          </Button>
                        ),
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profil de compétences global</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      value: { label: "Niveau moyen", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencesData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 4]} />
                        <Radar
                          name="Niveau moyen"
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

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des compétences</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      "Participation mission": { label: "Participation mission", color: "hsl(var(--chart-1))" },                      "Attentif radio": { label: "Attentif radio", color: "hsl(var(--chart-2))" },
                      Anticipation: { label: "Anticipation", color: "hsl(var(--chart-3))" },
                      Vigilance: { label: "Vigilance", color: "hsl(var(--chart-4))" },
                      Placements: { label: "Placements", color: "hsl(var(--chart-5))" },
                      "Respect consignes": { label: "Respect consignes", color: "hsl(var(--chart-6))" },
                      "Prise de contact": { label: "Prise de contact", color: "hsl(var(--chart-7))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={competencesData.map((item) => ({
                          name: item.subject,
                          value: item.value,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 4]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="value" fill="var(--color-value)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des compétences</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      "Participation mission": { label: "Participation mission", color: "hsl(var(--chart-1))" },
\

