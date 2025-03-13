// Ce code serait déployé comme une fonction Cloud Firebase
// Il s'exécuterait selon un calendrier défini (par exemple, tous les jours à minuit)

const functions = require("firebase-functions")
const admin = require("firebase-admin")
const nodemailer = require("nodemailer")

admin.initializeApp()

// Configuration de l'envoi d'emails (exemple avec Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Fonction déclenchée selon un calendrier
exports.sendScheduledReports = functions.pubsub
  .schedule("0 8 * * *") // Tous les jours à 8h00
  .timeZone("Europe/Paris")
  .onRun(async (context) => {
    try {
      const db = admin.firestore()

      // Récupérer la configuration des rapports automatisés
      const configDoc = await db.collection("settings").doc("automated_reports").get()

      if (!configDoc.exists) {
        console.log("Aucune configuration de rapports automatisés trouvée")
        return null
      }

      const config = configDoc.data()

      // Vérifier si les rapports automatisés sont activés
      if (!config.enabled) {
        console.log("Les rapports automatisés sont désactivés")
        return null
      }

      // Vérifier si c'est le bon jour pour envoyer le rapport
      const now = new Date()
      const dayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][now.getDay()]
      const dayOfMonth = now.getDate()

      let shouldSendReport = false

      if (config.frequency === "daily") {
        shouldSendReport = true
      } else if (config.frequency === "weekly" && config.day === dayOfWeek) {
        shouldSendReport = true
      } else if (config.frequency === "monthly") {
        if (config.day === "last") {
          // Vérifier si c'est le dernier jour du mois
          const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
          shouldSendReport = dayOfMonth === lastDayOfMonth
        } else {
          shouldSendReport = dayOfMonth === Number.parseInt(config.day)
        }
      }

      if (!shouldSendReport) {
        console.log("Ce n'est pas le jour prévu pour l'envoi des rapports")
        return null
      }

      // Vérifier si c'est la bonne heure
      const [configHour, configMinute] = config.time.split(":").map(Number)
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Tolérance de 5 minutes pour l'heure d'envoi
      const isRightTime =
        currentHour === configHour && currentMinute >= configMinute && currentMinute < configMinute + 5

      if (!isRightTime) {
        console.log("Ce n'est pas l'heure prévue pour l'envoi des rapports")
        return null
      }

      // Si nous arrivons ici, c'est le bon moment pour envoyer les rapports
      console.log("Début de l'envoi des rapports automatisés")

      // Déterminer la période du rapport
      let timeFrame = "week" // Par défaut

      if (config.frequency === "daily") {
        timeFrame = "day"
      } else if (config.frequency === "monthly") {
        timeFrame = "month"
      }

      // Récupérer les données pour le rapport
      const evaluations = await fetchEvaluations(db, timeFrame, config.sections)

      // Générer les rapports pour chaque type activé
      const reports = []

      if (config.reportTypes.summary) {
        reports.push(await generateReport(evaluations, "summary", timeFrame, config))
      }

      if (config.reportTypes.detailed) {
        reports.push(await generateReport(evaluations, "detailed", timeFrame, config))
      }

      if (config.reportTypes.trends) {
        reports.push(await generateReport(evaluations, "trends", timeFrame, config))
      }

      if (config.reportTypes.agentPerformance) {
        reports.push(await generateReport(evaluations, "agentPerformance", timeFrame, config))
      }

      // Envoyer les emails avec les rapports
      const results = await Promise.all(reports.map((report) => sendEmail(report, config.recipients)))

      // Enregistrer les résultats dans l'historique
      await Promise.all(
        results.map((result) =>
          db.collection("report_history").add({
            ...result,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          }),
        ),
      )

      console.log("Rapports automatisés envoyés avec succès")
      return null
    } catch (error) {
      console.error("Erreur lors de l'envoi des rapports automatisés:", error)
      return null
    }
  })

// Fonction pour récupérer les évaluations
async function fetchEvaluations(db, timeFrame, sections = []) {
  // Déterminer la plage de dates en fonction de la période
  const now = new Date()
  let startDate

  switch (timeFrame) {
    case "day":
      startDate = new Date(now)
      startDate.setHours(0, 0, 0, 0)
      break
    case "week":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    default:
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
  }

  // Construire la requête
  const query = db
    .collection("evaluations")
    .where("date", ">=", startDate.toISOString())
    .where("date", "<=", now.toISOString())

  // Ajouter le filtre de section si spécifié
  if (sections && sections.length > 0) {
    // Note: Firestore ne permet pas de filtrer directement sur un tableau de valeurs
    // Pour une implémentation réelle, il faudrait utiliser une approche différente
    // ou effectuer plusieurs requêtes
  }

  const snapshot = await query.get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Fonction pour générer un rapport
async function generateReport(evaluations, type, timeFrame, config) {
  // Cette fonction simule la génération d'un rapport
  // Dans une implémentation réelle, elle utiliserait la logique de génération de rapports

  const reportTitle =
    type === "summary"
      ? "Rapport de synthèse"
      : type === "detailed"
        ? "Rapport détaillé"
        : type === "trends"
          ? "Analyse des tendances"
          : "Performance des agents"

  const timeFrameText = timeFrame === "day" ? "Aujourd'hui" : timeFrame === "week" ? "Cette semaine" : "Ce mois"

  // Simuler la génération d'un PDF
  // Dans une implémentation réelle, nous utiliserions une bibliothèque comme jsPDF

  return {
    type,
    title: `${reportTitle} - ${timeFrameText}`,
    content: `Contenu du rapport ${type} pour la période ${timeFrame}`,
    // Dans une implémentation réelle, nous aurions ici le contenu HTML et le PDF
  }
}

// Fonction pour envoyer un email
async function sendEmail(report, recipients) {
  try {
    // Préparer l'email
    const mailOptions = {
      from: `"Système d'Évaluation GPIS" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject: report.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">${report.title}</h1>
          <p>Veuillez trouver ci-joint le rapport automatisé généré par le Système d'Évaluation GPIS.</p>
          <p>Ce rapport contient des informations confidentielles et est destiné uniquement aux personnes autorisées.</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            <p>Un aperçu du rapport est disponible ci-dessous. Pour une meilleure expérience, veuillez consulter le fichier PDF en pièce jointe.</p>
          </div>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 50px;">
            © ${new Date().getFullYear()} DIROPS - GPIS. Tous droits réservés.
          </p>
        </div>
      `,
      // Dans une implémentation réelle, nous ajouterions ici la pièce jointe PDF
      // attachments: [
      //   {
      //     filename: `${report.title.replace(/\s+/g, '_')}.pdf`,
      //     content: pdfBuffer,
      //     contentType: 'application/pdf'
      //   }
      // ]
    }

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions)

    return {
      type: report.type,
      recipients,
      status: "success",
      messageId: info.messageId,
      openRate: 0, // Sera mis à jour ultérieurement
      fileSize: "1.2 MB", // Simulé
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)

    return {
      type: report.type,
      recipients,
      status: "failed",
      error: error.message,
      openRate: 0,
      fileSize: "1.2 MB", // Simulé
    }
  }
}

