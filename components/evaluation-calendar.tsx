"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useEffect } from "react"

export function EvaluationCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [evaluationDates, setEvaluationDates] = useState<Date[]>([])
  const [selectedDateEvals, setSelectedDateEvals] = useState<any[]>([])

  useEffect(() => {
    // Récupérer toutes les dates d'évaluation
    const fetchEvaluationDates = async () => {
      const evalsRef = collection(db, "evaluations")
      const snapshot = await getDocs(evalsRef)

      const dates = snapshot.docs.map((doc) => {
        const data = doc.data()
        return new Date(data.date)
      })

      setEvaluationDates(dates)
    }

    fetchEvaluationDates()
  }, [])

  useEffect(() => {
    // Récupérer les évaluations pour la date sélectionnée
    const fetchSelectedDateEvaluations = async () => {
      if (!date) return

      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const evalsRef = collection(db, "evaluations")
      const q = query(
        evalsRef,
        where("date", ">=", startOfDay.toISOString()),
        where("date", "<=", endOfDay.toISOString()),
      )

      const snapshot = await getDocs(q)
      const evals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setSelectedDateEvals(evals)
    }

    fetchSelectedDateEvaluations()
  }, [date])

  // Fonction pour vérifier si une date a des évaluations
  const hasEvaluations = (day: Date) => {
    return evaluationDates.some(
      (evalDate) =>
        evalDate.getDate() === day.getDate() &&
        evalDate.getMonth() === day.getMonth() &&
        evalDate.getFullYear() === day.getFullYear(),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des évaluations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              hasEvaluation: evaluationDates,
            }}
            modifiersStyles={{
              hasEvaluation: {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fontWeight: "bold",
                borderBottom: "2px solid rgb(59, 130, 246)",
              },
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative">
                  {date.getDate()}
                  {hasEvaluations(date) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </div>
              ),
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Évaluations du {date?.toLocaleDateString()}</h3>

          {selectedDateEvals.length === 0 ? (
            <p className="text-muted-foreground">Aucune évaluation pour cette date</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvals.map((eval) => (
                <div key={eval.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{eval.agent}</p>
                      <p className="text-sm text-muted-foreground">
                        {eval.section} - {eval.indicatif}
                      </p>
                    </div>
                    <Badge>{Number(eval.moyenneGenerale).toFixed(1)}/4</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

