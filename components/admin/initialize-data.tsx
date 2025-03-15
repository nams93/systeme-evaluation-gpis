"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeCriteres } from "@/services/criteres-service"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export function InitializeData() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInitialize = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const success = await initializeCriteres()

      if (success) {
        setIsInitialized(true)
      } else {
        setError("Erreur lors de l'initialisation des données")
      }
    } catch (err) {
      setError(`Une erreur est survenue: ${err}`)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Initialisation des données
        </CardTitle>
        <CardDescription>Initialiser les critères d'évaluation dans la base de données</CardDescription>
      </CardHeader>
      <CardContent>
        {isInitialized && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-start gap-2 mb-4">
            <CheckCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Données initialisées</p>
              <p className="text-sm">Les critères d'évaluation ont été initialisés avec succès.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start gap-2 mb-4">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Cette action va initialiser les critères d'évaluation dans la base de données Supabase. Cette opération n'est
          nécessaire qu'une seule fois lors de la première configuration.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInitialize} disabled={isInitializing || isInitialized} className="w-full">
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initialisation en cours...
            </>
          ) : isInitialized ? (
            "Données déjà initialisées"
          ) : (
            "Initialiser les critères d'évaluation"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

