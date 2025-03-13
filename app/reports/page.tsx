"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AutomatedReportsConfig } from "@/components/reports/automated-reports-config"
import { ReportPreview } from "@/components/reports/report-preview"
import { ReportHistory } from "@/components/reports/report-history"
import { CustomReportGenerator } from "@/components/reports/custom-report-generator"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Gestion des rapports"
        text="Configurez et gérez les rapports automatisés et personnalisés"
      >
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="custom" className="space-y-6">
        <TabsList>
          <TabsTrigger value="custom">Rapports personnalisés</TabsTrigger>
          <TabsTrigger value="config">Configuration automatique</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <CustomReportGenerator />
        </TabsContent>

        <TabsContent value="config">
          <AutomatedReportsConfig />
        </TabsContent>

        <TabsContent value="preview">
          <ReportPreview />
        </TabsContent>

        <TabsContent value="history">
          <ReportHistory />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

