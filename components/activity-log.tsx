"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, limit, getDocs, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Edit, Trash, Download, LogIn, LogOut, User } from "lucide-react"

interface ActivityLogItem {
  id: string
  type: "creation" | "modification" | "suppression" | "export" | "login" | "logout"
  user: string
  timestamp: Timestamp
  details: string
  target?: string
}

// Fonction pour formater la date relative
function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `Il y a ${diffInSeconds} secondes`
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`

  return date.toLocaleDateString()
}

// Icône en fonction du type d'activité
function getActivityIcon(type: string) {
  switch (type) {
    case "creation":
      return <FileText className="h-4 w-4" />
    case "modification":
      return <Edit className="h-4 w-4" />
    case "suppression":
      return <Trash className="h-4 w-4" />
    case "export":
      return <Download className="h-4 w-4" />
    case "login":
      return <LogIn className="h-4 w-4" />
    case "logout":
      return <LogOut className="h-4 w-4" />
    default:
      return <User className="h-4 w-4" />
  }
}

// Couleur du badge en fonction du type d'activité
function getActivityBadgeVariant(type: string) {
  switch (type) {
    case "creation":
      return "default"
    case "modification":
      return "outline"
    case "suppression":
      return "destructive"
    case "export":
      return "secondary"
    case "login":
      return "default"
    case "logout":
      return "outline"
    default:
      return "outline"
  }
}

export function ActivityLog({ maxItems = 10 }) {
  const [activities, setActivities] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRef = collection(db, "activity_logs")
        const q = query(activitiesRef, orderBy("timestamp", "desc"), limit(maxItems))
        const snapshot = await getDocs(q)

        const activitiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActivityLogItem[]

        setActivities(activitiesData)
      } catch (error) {
        console.error("Erreur lors de la récupération des activités:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [maxItems])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal d'activité</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Aucune activité récente</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="mt-1 bg-muted rounded-full p-1.5">{getActivityIcon(activity.type)}</div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.user}</p>
                      <Badge variant={getActivityBadgeVariant(activity.type) as any}>
                        {activity.type === "creation" && "Création"}
                        {activity.type === "modification" && "Modification"}
                        {activity.type === "suppression" && "Suppression"}
                        {activity.type === "export" && "Export"}
                        {activity.type === "login" && "Connexion"}
                        {activity.type === "logout" && "Déconnexion"}
                      </Badge>
                    </div>

                    <p className="text-sm">{activity.details}</p>

                    <div className="flex items-center justify-between">
                      {activity.target && <p className="text-xs text-muted-foreground">{activity.target}</p>}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {formatRelativeTime(activity.timestamp.toDate())}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

