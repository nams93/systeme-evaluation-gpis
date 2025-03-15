"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Printer, BarChart, Users } from "lucide-react"

export function EvaluationReports() {
  const [reportType, setReportType] = useState("individual")
  const [section, setSection] = useState("")
  const [agent, setAgent] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simuler la génération d'un rapport
    setTimeout(() => {
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de rapports</CardTitle>
          <CardDescription>Créez des rapports personnalisés basés sur les évaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" onValueChange={setReportType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="individual">
                <FileText className="mr-2 h-4 w-4" />
                Rapport individuel
              </TabsTrigger>
              <TabsTrigger value="section">
                <Users className="mr-2 h-4 w-4" />
                Rapport par section
              </TabsTrigger>
              <TabsTrigger value="statistics">
                <BarChart className="mr-2 h-4 w-4" />
                Statistiques globales
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {reportType === "individual" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agent</label>
                    <Select value={agent} onValueChange={setAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent1">Jean Dupont</SelectItem>
                        <SelectItem value="agent2">Marie Martin</SelectItem>
                        <SelectItem value="agent3">Pierre Durand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {(reportType === "section" || reportType === "individual") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Section 1</SelectItem>
                      <SelectItem value="2">Section 2</SelectItem>
                      <SelectItem value="3">Section 3</SelectItem>
                      <SelectItem value="4">Section 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="Date de début"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="Date de fin"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? "Génération en cours..." : "Générer le rapport"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapports récents</CardTitle>
          <CardDescription>Accédez rapidement aux derniers rapports générés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Rapport individuel - Jean Dupont</h3>
                <p className="text-sm text-muted-foreground">Généré le 10/03/2023</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Rapport Section 2 - Mars 2023</h3>
                <p className="text-sm text-muted-foreground">Généré le 05/03/2023</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

