"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, ArrowRight } from "lucide-react"

export function QuickReportWidget() {
  const router = useRouter()
  const [reportType, setReportType] = useState("summary")
  const [timeFrame, setTimeFrame] = useState("week")

  const handleGenerateQuickReport = () => {
    // Rediriger vers la page des rapports avec les paramètres pré-remplis
    router.push(`/reports?type=${reportType}&timeFrame=${timeFrame}`)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Rapport rapide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-report-type" className="text-xs">
            Type de rapport
          </Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="quick-report-type" className="h-8 text-xs">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Synthèse</SelectItem>
              <SelectItem value="detailed">Détaillé</SelectItem>
              <SelectItem value="trends">Tendances</SelectItem>
              <SelectItem value="agentPerformance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quick-report-timeframe" className="text-xs">
            Période
          </Label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger id="quick-report-timeframe" className="h-8 text-xs">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerateQuickReport} className="w-full h-8 text-xs" variant="outline">
          Générer
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  )
}

