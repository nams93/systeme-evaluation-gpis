"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, ArrowRight } from "lucide-react"
import { migrateLocalDataToSupabase } from "@/utils/migrate-data"
import { getAllEvaluations } from "@/services/evaluation-service"

export function MigrationTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
  }>({})

  const localEvaluations = getAllEvaluations()
  const hasLocalData = localEvaluations.length > 0

  const handleMigration = async () => {
    setIsLoading(true)
    try {
      const migrationResult = await migrateLocalDataToSupabase()
      setResult(migrationResult)
    } catch (error) {
      setResult({
        success: false,
        message: `Erreur: ${error}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Migration des données
        </CardTitle>
        <CardDescription>Migrez vos données locales vers la base de données Supabase sécurisée</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div>
              <h3 className="font-medium">Données locales</h3>
              <p className="text-sm text-muted-foreground">
                {hasLocalData
                  ? `${localEvaluations.length} évaluations stockées localement`
                  : "Aucune donnée locale trouvée"}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Base de données Supabase</h3>
              <p className="text-sm text-muted-foreground">Stockage sécurisé et accessible partout</p>
            </div>
          </div>

          {result.message && (
            <div
              className={`p-4 rounded-md flex items-start gap-2 ${
                result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {result.success ? <CheckCircle className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
              <div>
                <p className="font-medium">{result.success ? "Succès" : "Erreur"}</p>
                <p className="text-sm">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleMigration} disabled={isLoading || !hasLocalData} className="w-full">
          {isLoading ? "Migration en cours..." : "Migrer les données vers Supabase"}
        </Button>
      </CardFooter>
    </Card>
  )
}

