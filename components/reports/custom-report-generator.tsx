"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "@/components/ui/use-toast"
import { Loader2, FileText, Download, Mail, Calendar, Filter } from "lucide-react"

export function CustomReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("summary")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [sections, setSections] = useState<string[]>([])
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [recipients, setRecipients] = useState("")
  const [availableSections, setAvailableSections] = useState(["Section 1", "Section 2", "Section 3", "Section 4"])

  const handleGenerateReport = async () => {
    try {
      setLoading(true)

      if (!startDate || !endDate) {
        toast({
          title: "Dates manquantes",
          description: "Veuillez sélectionner une date de début et de fin pour le rapport.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (endDate < startDate) {
        toast({
          title: "Plage de dates invalide",
          description: "La date de fin doit être postérieure à la date de début.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Simuler la génération du rapport
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Rapport généré",
        description: "Votre rapport personnalisé a été généré avec succès.",
      })

      // Dans une implémentation réelle, nous appellerions la fonction de génération de rapport
      // const { html, pdf } = await generateReport({
      //   type: reportType as any,
      //   timeFrame: "custom",
      //   startDate,
      //   endDate,
      //   sections: sections.length > 0 ? sections : undefined,
      //   includeCharts,
      //   includeTables
      // })

      // Simuler le téléchargement du PDF
      // Dans une implémentation réelle, nous utiliserions le blob PDF généré
      const reportTitle =
        reportType === "summary"
          ? "Rapport de synthèse"
          : reportType === "detailed"
            ? "Rapport détaillé"
            : reportType === "trends"
              ? "Analyse des tendances"
              : "Performance des agents"

      const fileName = `${reportTitle}_${formatDateForFileName(startDate)}_${formatDateForFileName(endDate)}.pdf`

      // Créer un lien de téléchargement fictif
      const link = document.createElement("a")
      link.href = "#"
      link.download = fileName
      link.click()
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du rapport.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendByEmail = async () => {
    try {
      setLoading(true)

      if (!startDate || !endDate) {
        toast({
          title: "Dates manquantes",
          description: "Veuillez sélectionner une date de début et de fin pour le rapport.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (endDate < startDate) {
        toast({
          title: "Plage de dates invalide",
          description: "La date de fin doit être postérieure à la date de début.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Valider les destinataires
      const emailList = recipients
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      if (emailList.length === 0) {
        toast({
          title: "Destinataires manquants",
          description: "Veuillez spécifier au moins un destinataire pour l'envoi par email.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Valider le format des emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = emailList.filter((email) => !emailRegex.test(email))

      if (invalidEmails.length > 0) {
        toast({
          title: "Emails invalides",
          description: `Les adresses suivantes ne sont pas valides: ${invalidEmails.join(", ")}`,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Simuler l'envoi du rapport par email
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Dans une implémentation réelle, nous appellerions la fonction d'envoi de rapport
      // const result = await sendReportByEmail({
      //   type: reportType as any,
      //   timeFrame: "custom",
      //   startDate,
      //   endDate,
      //   sections: sections.length > 0 ? sections : undefined,
      //   includeCharts,
      //   includeTables
      // }, emailList)

      toast({
        title: "Rapport envoyé",
        description: `Votre rapport personnalisé a été envoyé à ${emailList.length} destinataire(s).`,
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi du rapport par email:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du rapport par email.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section)
      } else {
        return [...prev, section]
      }
    })
  }

  // Formater la date pour le nom de fichier
  const formatDateForFileName = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Générateur de rapports personnalisés
        </CardTitle>
        <CardDescription>Créez des rapports sur mesure en fonction de vos besoins spécifiques</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
                  <SelectItem value="agentPerformance">Performance des agents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période du rapport</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-xs">
                    Date de début
                  </Label>
                  <DatePicker id="start-date" date={startDate} setDate={setStartDate} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-xs">
                    Date de fin
                  </Label>
                  <DatePicker id="end-date" date={endDate} setDate={setEndDate} className="w-full" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sections à inclure</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                {availableSections.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={`section-${section}`}
                      checked={sections.includes(section)}
                      onCheckedChange={() => toggleSection(section)}
                    />
                    <Label htmlFor={`section-${section}`} className="text-sm">
                      {section}
                    </Label>
                  </div>
                ))}
              </div>
              {sections.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Si aucune section n'est sélectionnée, toutes les sections seront incluses.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Éléments à inclure</Label>
              <div className="space-y-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                  />
                  <Label htmlFor="include-charts" className="text-sm">
                    Graphiques et visualisations
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-tables"
                    checked={includeTables}
                    onCheckedChange={(checked) => setIncludeTables(checked === true)}
                  />
                  <Label htmlFor="include-tables" className="text-sm">
                    Tableaux de données
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Destinataires (pour l'envoi par email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recipients"
                  placeholder="email@gpis.fr, responsable@gpis.fr"
                  className="pl-9"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Séparez les adresses email par des virgules. Laissez vide pour générer uniquement le rapport sans
                l'envoyer.
              </p>
            </div>

            <div className="rounded-md bg-muted p-4 mt-6">
              <h3 className="text-sm font-medium mb-2">Résumé de la demande</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {reportType === "summary"
                      ? "Rapport de synthèse"
                      : reportType === "detailed"
                        ? "Rapport détaillé"
                        : reportType === "trends"
                          ? "Analyse des tendances"
                          : "Performance des agents"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Du {startDate?.toLocaleDateString()} au {endDate?.toLocaleDateString()}
                  </span>
                </li>
                {sections.length > 0 && (
                  <li className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span>Sections: {sections.join(", ")}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleSendByEmail} disabled={loading || !recipients.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </>
          )}
        </Button>

        <Button onClick={handleGenerateReport} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Générer et télécharger
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

