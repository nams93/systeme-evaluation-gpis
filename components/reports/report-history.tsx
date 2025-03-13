"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Eye, History } from "lucide-react"
import { Timestamp } from "firebase/firestore"

interface ReportHistoryItem {
  id: string
  type: string
  sentAt: Timestamp
  recipients: string[]
  status: "success" | "partial" | "failed"
  openRate: number
  fileSize: string
}

export function ReportHistory() {
  const [history, setHistory] = useState<ReportHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchReportHistory = async () => {
      try {
        // Simuler la récupération des données depuis Firestore
        // Dans une implémentation réelle, vous utiliseriez une requête comme celle-ci:
        // const historyRef = collection(db, "report_history")
        // const q = query(historyRef, orderBy("sentAt", "desc"), limit(50))
        // const snapshot = await getDocs(q)
        // const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        // Données simulées pour l'exemple
        const mockData: ReportHistoryItem[] = [
          {
            id: "report-1",
            type: "Rapport hebdomadaire",
            sentAt: Timestamp.fromDate(new Date(Date.now() - 86400000)), // Hier
            recipients: ["responsable@gpis.fr", "direction@gpis.fr"],
            status: "success",
            openRate: 100,
            fileSize: "1.2 MB",
          },
          {
            id: "report-2",
            type: "Rapport de performance",
            sentAt: Timestamp.fromDate(new Date(Date.now() - 7 * 86400000)), // Il y a une semaine
            recipients: ["responsable@gpis.fr", "direction@gpis.fr", "formation@gpis.fr"],
            status: "partial",
            openRate: 67,
            fileSize: "2.4 MB",
          },
          {
            id: "report-3",
            type: "Rapport mensuel",
            sentAt: Timestamp.fromDate(new Date(Date.now() - 30 * 86400000)), // Il y a un mois
            recipients: ["direction@gpis.fr"],
            status: "success",
            openRate: 100,
            fileSize: "3.8 MB",
          },
          {
            id: "report-4",
            type: "Rapport d'analyse des tendances",
            sentAt: Timestamp.fromDate(new Date(Date.now() - 14 * 86400000)), // Il y a deux semaines
            recipients: ["responsable@gpis.fr", "direction@gpis.fr", "formation@gpis.fr"],
            status: "failed",
            openRate: 0,
            fileSize: "1.9 MB",
          },
        ]

        setHistory(mockData)
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des rapports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReportHistory()
  }, [])

  // Filtrer l'historique en fonction du terme de recherche
  const filteredHistory = history.filter(
    (item) =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipients.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Formater la date
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historique des rapports envoyés
        </CardTitle>
        <CardDescription>Consultez l'historique des rapports automatisés envoyés par email</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par type ou destinataire..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucun rapport ne correspond à votre recherche" : "Aucun rapport n'a encore été envoyé"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Taux d'ouverture</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{formatDate(item.sentAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {item.recipients.map((recipient, index) => (
                            <span key={index} className="text-xs">
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "success"
                              ? "default"
                              : item.status === "partial"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {item.status === "success" ? "Succès" : item.status === "partial" ? "Partiel" : "Échec"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.openRate}%</TableCell>
                      <TableCell>{item.fileSize}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" title="Voir le rapport">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

