"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Eye, Download, Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function ReportPreview() {
  const [reportType, setReportType] = useState("summary")
  const [timeframe, setTimeframe] = useState("week")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const handleGeneratePreview = () => {
    setLoading(true)

    // Simuler le chargement
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Aperçu généré",
        description: "L'aperçu du rapport a été généré avec succès.",
      })
    }, 1500)
  }

  const handleSendTestEmail = () => {
    setSending(true)

    // Simuler l'envoi
    setTimeout(() => {
      setSending(false)
      toast({
        title: "Email de test envoyé",
        description: "Un email de test a été envoyé à votre adresse.",
      })
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Prévisualisation des rapports
        </CardTitle>
        <CardDescription>Générez un aperçu des rapports automatisés pour vérifier leur contenu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Type de rapport</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Rapport de synthèse</SelectItem>
                <SelectItem value="detailed">Rapport détaillé</SelectItem>
                <SelectItem value="trends">Analyse des tendances</SelectItem>
                <SelectItem value="agent-performance">Performance des agents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Période</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <Button variant="outline" onClick={handleSendTestEmail} disabled={sending}>
            {sending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un email de test
              </>
            )}
          </Button>

          <Button onClick={handleGeneratePreview} disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Génération...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Générer un aperçu
              </>
            )}
          </Button>
        </div>

        {!loading && (
          <Tabs defaultValue="html" className="mt-4">
            <TabsList>
              <TabsTrigger value="html">Aperçu HTML</TabsTrigger>
              <TabsTrigger value="pdf">Aperçu PDF</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="mt-4">
              <div className="border rounded-md p-4 min-h-[400px] bg-white">
                <div className="text-center p-4 border-b mb-4">
                  <h2 className="text-xl font-bold">
                    Rapport{" "}
                    {reportType === "summary"
                      ? "de synthèse"
                      : reportType === "detailed"
                        ? "détaillé"
                        : reportType === "trends"
                          ? "d'analyse des tendances"
                          : "de performance des agents"}
                  </h2>
                  <p className="text-muted-foreground">
                    Période:{" "}
                    {timeframe === "day"
                      ? "Aujourd'hui"
                      : timeframe === "week"
                        ? "Cette semaine"
                        : timeframe === "month"
                          ? "Ce mois"
                          : "Ce trimestre"}
                  </p>
                </div>

                <div className="space-y-4">
                  <p>Ceci est un aperçu du contenu du rapport qui sera généré et envoyé par email.</p>

                  {reportType === "summary" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Résumé des évaluations</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded p-3">
                          <p className="font-medium">Total des évaluations</p>
                          <p className="text-2xl">24</p>
                        </div>
                        <div className="border rounded p-3">
                          <p className="font-medium">Score moyen</p>
                          <p className="text-2xl">3.2/4</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "trends" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Tendances des évaluations</h3>
                      <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                        [Graphique d'évolution des scores]
                      </div>
                    </div>
                  )}

                  {reportType === "agent-performance" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Performance des agents</h3>
                      <div className="border rounded">
                        <div className="grid grid-cols-4 gap-2 p-2 border-b bg-muted/30">
                          <div>Agent</div>
                          <div>Évaluations</div>
                          <div>Score moyen</div>
                          <div>Tendance</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 p-2 border-b">
                          <div>Agent 1</div>
                          <div>5</div>
                          <div>3.4/4</div>
                          <div>↗️</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 p-2 border-b">
                          <div>Agent 2</div>
                          <div>3</div>
                          <div>2.8/4</div>
                          <div>↘️</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="mt-4">
              <div className="flex flex-col items-center justify-center border rounded-md p-8 min-h-[400px] bg-muted/10">
                <div className="text-center space-y-4">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Aperçu PDF disponible</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Cliquez sur le bouton ci-dessous pour télécharger un exemple de rapport au format PDF.
                  </p>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger l'exemple PDF
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

