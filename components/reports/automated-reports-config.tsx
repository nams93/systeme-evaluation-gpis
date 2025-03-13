"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Mail, Save, Clock, FileText, BarChart2, Users } from "lucide-react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ReportConfig {
  enabled: boolean
  frequency: "daily" | "weekly" | "monthly"
  day?: string
  time: string
  recipients: string[]
  includeCharts: boolean
  includeTables: boolean
  sections: string[]
  reportTypes: {
    summary: boolean
    detailed: boolean
    trends: boolean
    agentPerformance: boolean
  }
}

export function AutomatedReportsConfig() {
  const [config, setConfig] = useState<ReportConfig>({
    enabled: false,
    frequency: "weekly",
    day: "monday",
    time: "08:00",
    recipients: [],
    includeCharts: true,
    includeTables: true,
    sections: [],
    reportTypes: {
      summary: true,
      detailed: false,
      trends: true,
      agentPerformance: true,
    },
  })

  const [recipientsInput, setRecipientsInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availableSections, setAvailableSections] = useState<string[]>([])

  // Charger la configuration existante
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, "settings", "automated_reports"))

        if (configDoc.exists()) {
          setConfig(configDoc.data() as ReportConfig)
          setRecipientsInput(configDoc.data().recipients.join(", "))
        }

        // Charger les sections disponibles
        const sectionsDoc = await getDoc(doc(db, "settings", "sections"))
        if (sectionsDoc.exists() && sectionsDoc.data().list) {
          setAvailableSections(sectionsDoc.data().list)
        } else {
          // Sections par défaut si aucune n'est configurée
          setAvailableSections(["Section 1", "Section 2", "Section 3", "Section 4"])
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la configuration des rapports automatisés.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleSaveConfig = async () => {
    try {
      setSaving(true)

      // Traiter les destinataires
      const recipients = recipientsInput
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      // Valider les emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = recipients.filter((email) => !emailRegex.test(email))

      if (invalidEmails.length > 0) {
        toast({
          title: "Emails invalides",
          description: `Les adresses suivantes ne sont pas valides: ${invalidEmails.join(", ")}`,
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // Mettre à jour la configuration
      const updatedConfig = {
        ...config,
        recipients,
      }

      // Sauvegarder dans Firestore
      await setDoc(doc(db, "settings", "automated_reports"), updatedConfig)

      toast({
        title: "Configuration enregistrée",
        description: updatedConfig.enabled
          ? `Les rapports seront envoyés ${
              updatedConfig.frequency === "daily"
                ? "chaque jour"
                : updatedConfig.frequency === "weekly"
                  ? "chaque semaine"
                  : "chaque mois"
            } aux destinataires spécifiés.`
          : "Les rapports automatiques ont été désactivés.",
      })

      // Mettre à jour l'état local
      setConfig(updatedConfig)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration des rapports automatisés.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (section: string) => {
    setConfig((prev) => {
      const sections = [...prev.sections]

      if (sections.includes(section)) {
        return { ...prev, sections: sections.filter((s) => s !== section) }
      } else {
        return { ...prev, sections: [...sections, section] }
      }
    })
  }

  const toggleReportType = (type: keyof ReportConfig["reportTypes"]) => {
    setConfig((prev) => ({
      ...prev,
      reportTypes: {
        ...prev.reportTypes,
        [type]: !prev.reportTypes[type],
      },
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rapports automatisés</CardTitle>
          <CardDescription>Chargement de la configuration...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Configuration des rapports automatisés
        </CardTitle>
        <CardDescription>Configurez l'envoi automatique de rapports d'évaluation par email</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="recipients">Destinataires</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reports-enabled">Activer les rapports automatiques</Label>
                <p className="text-sm text-muted-foreground">Envoi automatique de rapports récapitulatifs par email</p>
              </div>
              <Switch
                id="reports-enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            {config.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Fréquence</Label>
                  <Select
                    value={config.frequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly") =>
                      setConfig((prev) => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger id="frequency" className="w-full">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="day">Jour d'envoi</Label>
                    <Select
                      value={config.day}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, day: value }))}
                    >
                      <SelectTrigger id="day" className="w-full">
                        <SelectValue placeholder="Sélectionner un jour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Lundi</SelectItem>
                        <SelectItem value="tuesday">Mardi</SelectItem>
                        <SelectItem value="wednesday">Mercredi</SelectItem>
                        <SelectItem value="thursday">Jeudi</SelectItem>
                        <SelectItem value="friday">Vendredi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {config.frequency === "monthly" && (
                  <div className="space-y-2">
                    <Label htmlFor="day">Jour du mois</Label>
                    <Select
                      value={config.day}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, day: value }))}
                    >
                      <SelectTrigger id="day" className="w-full">
                        <SelectValue placeholder="Sélectionner un jour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1er du mois</SelectItem>
                        <SelectItem value="15">15 du mois</SelectItem>
                        <SelectItem value="last">Dernier jour du mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="time">Heure d'envoi</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={config.time}
                      onChange={(e) => setConfig((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Types de rapports</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="report-summary"
                    checked={config.reportTypes.summary}
                    onCheckedChange={() => toggleReportType("summary")}
                  />
                  <Label htmlFor="report-summary" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Rapport de synthèse
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="report-detailed"
                    checked={config.reportTypes.detailed}
                    onCheckedChange={() => toggleReportType("detailed")}
                  />
                  <Label htmlFor="report-detailed" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Rapport détaillé
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="report-trends"
                    checked={config.reportTypes.trends}
                    onCheckedChange={() => toggleReportType("trends")}
                  />
                  <Label htmlFor="report-trends" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Analyse des tendances
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="report-agent-performance"
                    checked={config.reportTypes.agentPerformance}
                    onCheckedChange={() => toggleReportType("agentPerformance")}
                  />
                  <Label htmlFor="report-agent-performance" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Performance des agents
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Éléments à inclure</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={config.includeCharts}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeCharts: checked === true }))}
                  />
                  <Label htmlFor="include-charts">Graphiques et visualisations</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-tables"
                    checked={config.includeTables}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeTables: checked === true }))}
                  />
                  <Label htmlFor="include-tables">Tableaux de données</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Sections à inclure</h3>

              <div className="grid grid-cols-2 gap-2">
                {availableSections.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={`section-${section}`}
                      checked={config.sections.includes(section)}
                      onCheckedChange={() => toggleSection(section)}
                    />
                    <Label htmlFor={`section-${section}`}>{section}</Label>
                  </div>
                ))}
              </div>

              {config.sections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Si aucune section n'est sélectionnée, toutes les sections seront incluses.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipients">Destinataires</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipients"
                    placeholder="email@gpis.fr, responsable@gpis.fr"
                    className="pl-9"
                    value={recipientsInput}
                    onChange={(e) => setRecipientsInput(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Séparez les adresses email par des virgules</p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Aperçu des destinataires</h3>

              {recipientsInput.split(",").filter((email) => email.trim().length > 0).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recipientsInput.split(",").map((email, index) => {
                    const trimmedEmail = email.trim()
                    if (!trimmedEmail) return null

                    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

                    return (
                      <div
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isValid ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {trimmedEmail}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun destinataire spécifié</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveConfig} disabled={saving}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer la configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

