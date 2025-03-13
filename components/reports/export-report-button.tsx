"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Download, FileText, FileSpreadsheet, FileDown, Loader2 } from "lucide-react"
import { exportData, downloadFile, type ExportFormat } from "@/lib/export-service"

interface ExportReportButtonProps {
  data: any[]
  columns: { header: string; accessorKey: string }[]
  filename: string
  title?: string
  subtitle?: string
  disabled?: boolean
}

export function ExportReportButton({
  data,
  columns,
  filename,
  title,
  subtitle,
  disabled = false,
}: ExportReportButtonProps) {
  const [loading, setLoading] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    try {
      setLoading(format)

      // Vérifier si des données sont disponibles
      if (data.length === 0) {
        toast({
          title: "Aucune donnée à exporter",
          description: "Il n'y a pas de données disponibles pour l'exportation.",
          variant: "destructive",
        })
        setLoading(null)
        return
      }

      // Générer le fichier d'exportation
      const exportedData = await exportData({
        format,
        filename,
        title,
        subtitle,
        data,
        columns,
        includeCharts: format === "pdf",
      })

      // Télécharger le fichier
      downloadFile(exportedData, filename, format)

      toast({
        title: "Exportation réussie",
        description: `Le rapport a été exporté au format ${
          format === "pdf" ? "PDF" : format === "excel" ? "Excel" : "CSV"
        }.`,
      })
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error)
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation du rapport.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || loading !== null}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportation...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exporter en Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileDown className="mr-2 h-4 w-4" />
          Exporter en CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

