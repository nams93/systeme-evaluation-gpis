import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { jsPDF } from "jspdf"

// Types pour les rapports
export type ReportType = "summary" | "detailed" | "trends" | "agentPerformance"
// Ajouter le support pour les rapports personnalisés avec des dates spécifiques
export type TimeFrame = "day" | "week" | "month" | "quarter" | "custom"

interface ReportOptions {
  type: ReportType
  timeFrame: TimeFrame
  startDate?: Date
  endDate?: Date
  sections?: string[]
  includeCharts?: boolean
  includeTables?: boolean
}

export async function generateReport(options: ReportOptions): Promise<{ html: string; pdf: Blob }> {
  // Récupérer les données pour le rapport
  const data = await fetchReportData(options)

  // Générer le HTML du rapport
  const html = generateReportHtml(data, options)

  // Générer le PDF du rapport
  const pdf = await generateReportPdf(data, options)

  return { html, pdf }
}

async function fetchReportData(options: ReportOptions) {
  // Déterminer la plage de dates en fonction de la période
  const now = new Date()
  let startDate: Date
  let endDate: Date = now

  if (options.timeFrame === "custom" && options.startDate && options.endDate) {
    startDate = options.startDate
    endDate = options.endDate
  } else {
    switch (options.timeFrame) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 3)
        break
      default:
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
    }
  }

  // Construire la requête Firestore
  const evalsRef = collection(db, "evaluations")
  let q = query(evalsRef, where("date", ">=", startDate.toISOString()), where("date", "<=", endDate.toISOString()))

  // Ajouter le filtre de section si spécifié
  if (options.sections && options.sections.length > 0) {
    q = query(q, where("section", "in", options.sections))
  }

  // Exécuter la requête
  const snapshot = await getDocs(q)

  // Traiter les résultats
  const evaluations = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  // Calculer les statistiques en fonction du type de rapport
  const stats = calculateReportStats(evaluations, options.type)

  return {
    evaluations,
    stats,
    timeFrame: options.timeFrame,
    startDate,
    endDate,
  }
}

function calculateReportStats(evaluations: any[], type: ReportType) {
  // Statistiques de base pour tous les types de rapports
  const totalEvaluations = evaluations.length

  // Calculer le score moyen global
  const averageScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, eval) => sum + Number(eval.moyenneGenerale || 0), 0) / evaluations.length
      : 0

  // Regrouper par agent
  const agentStats = {}
  evaluations.forEach((eval) => {
    const agent = eval.agent

    if (!agentStats[agent]) {
      agentStats[agent] = {
        count: 0,
        totalScore: 0,
        scores: [],
      }
    }

    agentStats[agent].count++
    agentStats[agent].totalScore += Number(eval.moyenneGenerale || 0)
    agentStats[agent].scores.push({
      date: eval.date,
      score: Number(eval.moyenneGenerale || 0),
    })
  })

  // Calculer les moyennes par agent
  Object.keys(agentStats).forEach((agent) => {
    agentStats[agent].averageScore = agentStats[agent].totalScore / agentStats[agent].count

    // Trier les scores par date
    agentStats[agent].scores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculer la tendance (en comparant le premier et le dernier score)
    const scores = agentStats[agent].scores
    if (scores.length >= 2) {
      const firstScore = scores[0].score
      const lastScore = scores[scores.length - 1].score
      agentStats[agent].trend = lastScore - firstScore
    } else {
      agentStats[agent].trend = 0
    }
  })

  // Statistiques spécifiques au type de rapport
  switch (type) {
    case "summary":
      return {
        totalEvaluations,
        averageScore,
        agentStats,
        // Ajouter d'autres statistiques de synthèse si nécessaire
      }

    case "detailed":
      // Calculer des statistiques détaillées par compétence
      const skillStats = {}

      // Liste des compétences à analyser
      const skills = [
        "connaissances_juridiques",
        "connaissance_structure",
        "connaissance_patrimoine",
        "transmissions",
        "vigilance",
        "deplacement",
        "distances",
        "positionnement",
        "contact",
        "stress",
        "participation",
      ]

      // Calculer les moyennes par compétence
      skills.forEach((skill) => {
        const validScores = evaluations.map((eval) => Number(eval[skill] || 0)).filter((score) => score > 0)

        skillStats[skill] = {
          average: validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0,
          count: validScores.length,
        }
      })

      return {
        totalEvaluations,
        averageScore,
        agentStats,
        skillStats,
      }

    case "trends":
      // Regrouper les évaluations par période (jour, semaine, mois)
      const timeSeriesData = {}

      evaluations.forEach((eval) => {
        const date = new Date(eval.date)
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

        if (!timeSeriesData[monthYear]) {
          timeSeriesData[monthYear] = {
            date: monthYear,
            count: 0,
            totalScore: 0,
          }
        }

        timeSeriesData[monthYear].count++
        timeSeriesData[monthYear].totalScore += Number(eval.moyenneGenerale || 0)
      })

      // Calculer les moyennes par période
      Object.keys(timeSeriesData).forEach((period) => {
        timeSeriesData[period].averageScore = timeSeriesData[period].totalScore / timeSeriesData[period].count
      })

      return {
        totalEvaluations,
        averageScore,
        agentStats,
        timeSeriesData: Object.values(timeSeriesData),
      }

    case "agentPerformance":
      // Trier les agents par score moyen
      const sortedAgents = Object.entries(agentStats)
        .map(([agent, stats]) => ({
          agent,
          ...stats,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)

      return {
        totalEvaluations,
        averageScore,
        agentStats,
        sortedAgents,
      }

    default:
      return {
        totalEvaluations,
        averageScore,
        agentStats,
      }
  }
}

function generateReportHtml(data: any, options: ReportOptions): string {
  // Titre du rapport
  const reportTitle =
    options.type === "summary"
      ? "Rapport de synthèse"
      : options.type === "detailed"
        ? "Rapport détaillé"
        : options.type === "trends"
          ? "Analyse des tendances"
          : "Performance des agents"

  // Période du rapport
  const timeFrameText =
    options.timeFrame === "day"
      ? "Aujourd'hui"
      : options.timeFrame === "week"
        ? "Cette semaine"
        : options.timeFrame === "month"
          ? "Ce mois"
          : "Ce trimestre"

  // Date de génération
  const generationDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Construire le HTML en fonction du type de rapport
  let contentHtml = ""

  switch (options.type) {
    case "summary":
      contentHtml = `
        <div class="summary-stats">
          <div class="stat-card">
            <h3>Total des évaluations</h3>
            <p class="stat-value">${data.stats.totalEvaluations}</p>
          </div>
          <div class="stat-card">
            <h3>Score moyen</h3>
            <p class="stat-value">${data.stats.averageScore.toFixed(2)}/4</p>
          </div>
        </div>
        
        <h3>Résumé par agent</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Évaluations</th>
              <th>Score moyen</th>
              <th>Tendance</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(data.stats.agentStats)
              .map(
                ([agent, stats]) => `
              <tr>
                <td>${agent}</td>
                <td>${stats.count}</td>
                <td>${stats.averageScore.toFixed(2)}/4</td>
                <td>${stats.trend > 0 ? "↗️" : stats.trend < 0 ? "↘️" : "→"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
      break

    case "detailed":
      contentHtml = `
        <div class="summary-stats">
          <div class="stat-card">
            <h3>Total des évaluations</h3>
            <p class="stat-value">${data.stats.totalEvaluations}</p>
          </div>
          <div class="stat-card">
            <h3>Score moyen</h3>
            <p class="stat-value">${data.stats.averageScore.toFixed(2)}/4</p>
          </div>
        </div>
        
        <h3>Analyse détaillée par compétence</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Compétence</th>
              <th>Score moyen</th>
              <th>Évaluations</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(data.stats.skillStats)
              .map(([skill, stats]) => {
                const skillName =
                  skill === "connaissances_juridiques"
                    ? "Connaissances Juridiques"
                    : skill === "connaissance_structure"
                      ? "Connaissance Structure"
                      : skill === "connaissance_patrimoine"
                        ? "Connaissance Patrimoine"
                        : skill === "transmissions"
                          ? "Transmissions"
                          : skill === "vigilance"
                            ? "Vigilance"
                            : skill === "deplacement"
                              ? "Déplacement"
                              : skill === "distances"
                                ? "Distances"
                                : skill === "positionnement"
                                  ? "Positionnement"
                                  : skill === "contact"
                                    ? "Contact"
                                    : skill === "stress"
                                      ? "Gestion du stress"
                                      : skill === "participation"
                                        ? "Participation"
                                        : skill

                return `
                <tr>
                  <td>${skillName}</td>
                  <td>${stats.average.toFixed(2)}/4</td>
                  <td>${stats.count}</td>
                </tr>
              `
              })
              .join("")}
          </tbody>
        </table>
      `
      break

    case "trends":
      contentHtml = `
        <h3>Évolution des scores dans le temps</h3>
        <div class="chart-placeholder">
          [Graphique d'évolution des scores]
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Période</th>
              <th>Évaluations</th>
              <th>Score moyen</th>
            </tr>
          </thead>
          <tbody>
            ${data.stats.timeSeriesData
              .map(
                (period) => `
              <tr>
                <td>${period.date}</td>
                <td>${period.count}</td>
                <td>${period.averageScore.toFixed(2)}/4</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
      break

    case "agentPerformance":
      contentHtml = `
        <h3>Classement des agents par performance</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Agent</th>
              <th>Évaluations</th>
              <th>Score moyen</th>
              <th>Tendance</th>
            </tr>
          </thead>
          <tbody>
            ${data.stats.sortedAgents
              .map(
                (agent, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${agent.agent}</td>
                <td>${agent.count}</td>
                <td>${agent.averageScore.toFixed(2)}/4</td>
                <td>${agent.trend > 0 ? "↗️" : agent.trend < 0 ? "↘️" : "→"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <h3>Analyse des performances individuelles</h3>
        <div class="chart-placeholder">
          [Graphique radar des compétences par agent]
        </div>
      `
      break
  }

  // Assembler le HTML complet
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportTitle} - ${timeFrameText}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .report-subtitle {
          font-size: 16px;
          color: #666;
        }
        .report-date {
          font-size: 14px;
          color: #888;
          margin-top: 10px;
        }
        .summary-stats {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
        }
        .stat-card {
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          width: 200px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        h3 {
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .data-table th, .data-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .data-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .data-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .chart-placeholder {
          background-color: #f5f5f5;
          border: 1px dashed #ccc;
          border-radius: 5px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          color: #888;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="report-title">${reportTitle}</div>
        <div class="report-subtitle">Période: ${timeFrameText}</div>
        <div class="report-date">Généré le: ${generationDate}</div>
      </div>
      
      ${contentHtml}
      
      <div class="footer">
        <p>Rapport généré automatiquement par le Système d'Évaluation GPIS</p>
        <p>© ${new Date().getFullYear()} DIROPS - GPIS. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `
}

async function generateReportPdf(data: any, options: ReportOptions): Promise<Blob> {
  // Créer un nouveau document PDF
  const doc = new jsPDF()

  // Titre du rapport
  const reportTitle =
    options.type === "summary"
      ? "Rapport de synthèse"
      : options.type === "detailed"
        ? "Rapport détaillé"
        : options.type === "trends"
          ? "Analyse des tendances"
          : "Performance des agents"

  // Période du rapport
  const timeFrameText =
    options.timeFrame === "day"
      ? "Aujourd'hui"
      : options.timeFrame === "week"
        ? "Cette semaine"
        : options.timeFrame === "month"
          ? "Ce mois"
          : "Ce trimestre"

  // Date de génération
  const generationDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Ajouter l'en-tête
  doc.setFontSize(18)
  doc.text(reportTitle, 105, 20, { align: "center" })

  doc.setFontSize(12)
  doc.text(`Période: ${timeFrameText}`, 105, 30, { align: "center" })

  doc.setFontSize(10)
  doc.text(`Généré le: ${generationDate}`, 105, 40, { align: "center" })

  // Contenu spécifique au type de rapport
  let yPosition = 50

  switch (options.type) {
    case "summary":
      // Statistiques de base
      doc.setFontSize(14)
      doc.text("Statistiques générales", 14, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.text(`Total des évaluations: ${data.stats.totalEvaluations}`, 14, yPosition)
      yPosition += 8

      doc.text(`Score moyen: ${data.stats.averageScore.toFixed(2)}/4`, 14, yPosition)
      yPosition += 15

      // Tableau des agents
      doc.setFontSize(14)
      doc.text("Résumé par agent", 14, yPosition)
      yPosition += 10

      const agentTableData = Object.entries(data.stats.agentStats).map(([agent, stats]) => [
        agent,
        stats.count,
        `${stats.averageScore.toFixed(2)}/4`,
        stats.trend > 0 ? "↗️" : stats.trend < 0 ? "↘️" : "→",
      ])

      // @ts-ignore
      doc.autoTable({
        startY: yPosition,
        head: [["Agent", "Évaluations", "Score moyen", "Tendance"]],
        body: agentTableData,
      })

      break

    case "detailed":
      // Statistiques de base
      doc.setFontSize(14)
      doc.text("Statistiques générales", 14, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.text(`Total des évaluations: ${data.stats.totalEvaluations}`, 14, yPosition)
      yPosition += 8

      doc.text(`Score moyen: ${data.stats.averageScore.toFixed(2)}/4`, 14, yPosition)
      yPosition += 15

      // Tableau des compétences
      doc.setFontSize(14)
      doc.text("Analyse détaillée par compétence", 14, yPosition)
      yPosition += 10

      const skillTableData = Object.entries(data.stats.skillStats).map(([skill, stats]) => {
        const skillName =
          skill === "connaissances_juridiques"
            ? "Connaissances Juridiques"
            : skill === "connaissance_structure"
              ? "Connaissance Structure"
              : skill === "connaissance_patrimoine"
                ? "Connaissance Patrimoine"
                : skill === "transmissions"
                  ? "Transmissions"
                  : skill === "vigilance"
                    ? "Vigilance"
                    : skill === "deplacement"
                      ? "Déplacement"
                      : skill === "distances"
                        ? "Distances"
                        : skill === "positionnement"
                          ? "Positionnement"
                          : skill === "contact"
                            ? "Contact"
                            : skill === "stress"
                              ? "Gestion du stress"
                              : skill === "participation"
                                ? "Participation"
                                : skill

        return [skillName, `${stats.average.toFixed(2)}/4`, stats.count]
      })

      // @ts-ignore
      doc.autoTable({
        startY: yPosition,
        head: [["Compétence", "Score moyen", "Évaluations"]],
        body: skillTableData,
      })

      break

    case "trends":
      // Statistiques d'évolution
      doc.setFontSize(14)
      doc.text("Évolution des scores dans le temps", 14, yPosition)
      yPosition += 10

      // Note: Dans un cas réel, nous ajouterions ici un graphique
      doc.setFontSize(10)
      doc.text("(Graphique d'évolution des scores)", 105, yPosition + 20, { align: "center" })
      yPosition += 50

      // Tableau des périodes
      const timeSeriesTableData = data.stats.timeSeriesData.map((period) => [
        period.date,
        period.count,
        `${period.averageScore.toFixed(2)}/4`,
      ])

      // @ts-ignore
      doc.autoTable({
        startY: yPosition,
        head: [["Période", "Évaluations", "Score moyen"]],
        body: timeSeriesTableData,
      })

      break

    case "agentPerformance":
      // Classement des agents
      doc.setFontSize(14)
      doc.text("Classement des agents par performance", 14, yPosition)
      yPosition += 10

      const performanceTableData = data.stats.sortedAgents.map((agent, index) => [
        index + 1,
        agent.agent,
        agent.count,
        `${agent.averageScore.toFixed(2)}/4`,
        agent.trend > 0 ? "↗️" : agent.trend < 0 ? "↘️" : "→",
      ])

      // @ts-ignore
      doc.autoTable({
        startY: yPosition,
        head: [["Rang", "Agent", "Évaluations", "Score moyen", "Tendance"]],
        body: performanceTableData,
      })

      // Note: Dans un cas réel, nous ajouterions ici un graphique radar
      yPosition = doc.autoTable.previous.finalY + 20
      doc.setFontSize(14)
      doc.text("Analyse des performances individuelles", 14, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.text("(Graphique radar des compétences par agent)", 105, yPosition + 20, { align: "center" })

      break
  }

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

  // Convertir le PDF en Blob
  return doc.output("blob")
}

// Fonction pour envoyer un rapport par email
export async function sendReportByEmail(
  reportOptions: ReportOptions,
  recipients: string[],
  subject?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Générer le rapport
    const { html, pdf } = await generateReport(reportOptions)

    // Construire le sujet de l'email
    const reportTitle =
      reportOptions.type === "summary"
        ? "Rapport de synthèse"
        : reportOptions.type === "detailed"
          ? "Rapport détaillé"
          : reportOptions.type === "trends"
            ? "Analyse des tendances"
            : "Performance des agents"

    const timeFrameText =
      reportOptions.timeFrame === "day"
        ? "Aujourd'hui"
        : reportOptions.timeFrame === "week"
          ? "Cette semaine"
          : reportOptions.timeFrame === "month"
            ? "Ce mois"
            : "Ce trimestre"

    const emailSubject = subject || `${reportTitle} - ${timeFrameText} - Système d'Évaluation GPIS`

    // Dans une implémentation réelle, nous utiliserions ici un service d'envoi d'emails
    // comme SendGrid, Mailjet, ou un service SMTP

    // Simuler l'envoi d'email pour cet exemple
    console.log(`Envoi du rapport "${emailSubject}" à ${recipients.join(", ")}`)

    // Enregistrer l'envoi dans l'historique
    // await logReportSent(reportOptions, recipients, emailSubject, pdf.size)

    return {
      success: true,
      message: `Rapport envoyé avec succès à ${recipients.length} destinataire(s)`,
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du rapport:", error)
    return {
      success: false,
      message: `Erreur lors de l'envoi du rapport: ${error.message}`,
    }
  }
}

