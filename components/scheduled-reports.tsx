"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Mail, Save } from "lucide-react"

export function ScheduledReports() {
  const [enabled, setEnabled] = useState(false)
  const [frequency, setFrequency] = useState("weekly")
  const [recipients, setRecipients] = useState("")
  const [day, setDay] = useState("monday")
  const [saving, setSaving] = useState(false)

  const handleSaveSettings = async () => {
    setSaving(true)

    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Paramètres enregistrés",
      description: enabled
        ? `Les rapports seront envoyés ${frequency === "weekly" ? "chaque semaine" : "chaque mois"} aux destinataires spécifiés.`
        : "Les rapports automatiques ont été désactivés.",
    })

    setSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Rapports automatisés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reports-enabled">Activer les rapports automatiques</Label>
            <p className="text-sm text-muted-foreground">Envoi automatique de rapports récapitulatifs par email</p>
          </div>
          <Switch id="reports-enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Sélectionner une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="day">Jour d'envoi</Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger id="day">
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

            <div className="space-y-2">
              <Label htmlFor="recipients">Destinataires</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipients"
                    placeholder="email@gpis.fr, responsable@gpis.fr"
                    className="pl-9"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Séparez les adresses email par des virgules</p>
            </div>
          </>
        )}

        <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

