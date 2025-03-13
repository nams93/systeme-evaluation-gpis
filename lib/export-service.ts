import { jsPDF } from "jspdf"
import * as XLSX from "xlsx"

// Types d'exportation supportés
export type ExportFormat = "pdf" | "excel" | "csv"

// Options pour l'exportation
export interface ExportOptions {
  format: ExportFormat
  filename: string
  title?: string
  subtitle?: string
  data: any[]
  columns: { header: string; accessorKey: string }[]
  includeCharts?: boolean
  logo?: string
}

// Fonction principale d'exportation
export async function exportData(options: ExportOptions): Promise<Blob | string> {
  switch (options.format) {
    case "pdf":
      return exportToPDF(options)
    case "excel":
      return exportToExcel(options)
    case "csv":
      return exportToCSV(options)
    default:
      throw new Error(`Format d'exportation non supporté: ${options.format}`)
  }
}

// Exportation au format PDF
async function exportToPDF(options: ExportOptions): Promise<Blob> {
  const { filename, title, subtitle, data, columns } = options

  // Créer un nouveau document PDF
  const doc = new jsPDF()

  // Ajouter le titre
  doc.setFontSize(18)
  doc.text(title || filename, 105, 20, { align: "center" })

  // Ajouter le sous-titre si présent
  if (subtitle) {
    doc.setFontSize(12)
    doc.text(subtitle, 105, 30, { align: "center" })
  }

  // Date de génération
  const generationDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  doc.setFontSize(10)
  doc.text(`Généré le: ${generationDate}`, 105, 40, { align: "center" })

  // Préparer les données pour le tableau
  const tableHeaders = columns.map((column) => column.header)
  const tableData = data.map((item) => columns.map((column) => item[column.accessorKey]))

  // Ajouter le tableau
  // @ts-ignore
  doc.autoTable({
    startY: 50,
    head: [tableHeaders],
    body: tableData,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  // Ajouter le pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Rapport généré automatiquement par le Système d'Évaluation GPIS - Page ${i} sur ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  // Retourner le PDF sous forme de Blob
  return doc.output("blob")
}

// Exportation au format Excel
function exportToExcel(options: ExportOptions): Blob {
  const { filename, title, data, columns } = options

  // Créer un nouveau classeur
  const workbook = XLSX.utils.book_new()

  // Préparer les données
  const worksheetData = [
    columns.map((column) => column.header), // En-têtes
    ...data.map((item) => columns.map((column) => item[column.accessorKey])), // Données
  ]

  // Créer une feuille de calcul
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(workbook, worksheet, title || "Données")

  // Convertir le classeur en tableau binaire
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

  // Créer un Blob à partir du tableau binaire
  return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

// Exportation au format CSV
function exportToCSV(options: ExportOptions): string {
  const { data, columns } = options

  // Préparer les en-têtes
  const headers = columns.map((column) => column.header)

  // Préparer les lignes de données
  const rows = data.map((item) =>
    columns.map((column) => {
      const value = item[column.accessorKey]
      // Échapper les virgules et les guillemets pour le format CSV
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }),
  )

  // Assembler le CSV
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

// Fonction utilitaire pour télécharger un fichier
export function downloadFile(data: Blob | string, filename: string, format: ExportFormat) {
  const url =
    data instanceof Blob ? URL.createObjectURL(data) : `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`

  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.${format === "excel" ? "xlsx" : format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  if (data instanceof Blob) {
    URL.revokeObjectURL(url)
  }
}

