import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export function exportToPDF(data, filename = "export") {
  const doc = new jsPDF()

  // Ajouter le plugin autoTable à jsPDF
  // @ts-ignore
  if (typeof doc.autoTable !== "function") {
    // @ts-ignore
    doc.autoTable = autoTable
  }

  // Titre
  doc.setFontSize(18)
  doc.text("Rapport d'évaluations des agents", 105, 20, { align: "center" })

  // Date d'exportation
  doc.setFontSize(12)
  doc.text(`Date d'exportation: ${new Date().toLocaleDateString()}`, 20, 30)

  // Tableau des évaluations
  const tableColumn = ["Date", "Agent", "Section", "Indicatif", "Savoirs", "Savoirs-Faire", "Savoirs-Être", "Moyenne"]
  const tableRows = data.map((item) => [
    item.date,
    item.agent,
    item.section,
    item.indicatif,
    item.savoirsConnaissances,
    item.savoirsFaire,
    item.savoirsEtre,
    item.moyenneGenerale,
  ])

  // @ts-ignore
  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 40 },
  })

  // Statistiques
  if (data.length > 0) {
    const avgScore = (data.reduce((sum, item) => sum + Number(item.moyenneGenerale || 0), 0) / data.length).toFixed(2)

    doc.setFontSize(14)
    // @ts-ignore
    doc.text("Statistiques", 20, doc.autoTable.previous.finalY + 20)
    doc.setFontSize(12)
    // @ts-ignore
    doc.text(`Nombre d'évaluations: ${data.length}`, 20, doc.autoTable.previous.finalY + 30)
    // @ts-ignore
    doc.text(`Score moyen: ${avgScore}/4`, 20, doc.autoTable.previous.finalY + 40)
  }

  // Enregistrer le PDF
  doc.save(`${filename}.pdf`)
}

export function exportToCSV(data, filename = "export") {
  // Définir les en-têtes
  const headers = [
    "Date",
    "Agent",
    "Section",
    "Indicatif",
    // Savoirs et Connaissances
    "Connaissances Juridiques",
    "Connaissance Structure",
    "Connaissance Patrimoine",
    // Savoirs-Faire
    "Transmissions",
    "Vigilance",
    "Déplacement",
    "Distances",
    "Positionnement",
    "Contact",
    "Stress",
    "Participation",
    // Savoirs-Être
    "Maîtrise",
    "Équipements",
    "Tenue",
    "Propreté",
    "Véhicule",
    "Comportement",
    "Exemplarité",
    "Motivation",
    "Interaction",
    "Hiérarchie",
    // Moyennes
    "Savoirs",
    "Savoirs-Faire",
    "Savoirs-Être",
    "Moyenne",
    "Observation",
  ]

  // Convertir les données en lignes CSV
  const rows = data.map((item) => [
    item.date,
    item.agent,
    item.section,
    item.indicatif,
    // Savoirs et Connaissances
    item.connaissances_juridiques,
    item.connaissance_structure,
    item.connaissance_patrimoine,
    // Savoirs-Faire
    item.transmissions,
    item.vigilance,
    item.deplacement,
    item.distances,
    item.positionnement,
    item.contact,
    item.stress,
    item.participation,
    // Savoirs-Être
    item.maitrise,
    item.equipements,
    item.tenue,
    item.proprete,
    item.vehicule,
    item.comportement,
    item.exemplarite,
    item.motivation,
    item.interaction,
    item.hierarchie,
    // Moyennes
    item.savoirsConnaissances,
    item.savoirsFaire,
    item.savoirsEtre,
    item.moyenneGenerale,
    item.observation || "",
  ])

  // Ajouter les en-têtes au début
  rows.unshift(headers)

  // Convertir en chaîne CSV
  const csvContent = rows.map((row) => row.join(",")).join("\n")

  // Créer un blob et un lien de téléchargement
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

