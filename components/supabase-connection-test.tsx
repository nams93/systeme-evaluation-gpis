"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test simple pour vérifier la connexion
        const { data, error } = await supabase.from("agents").select("count").limit(1)

        if (error) throw error

        setStatus("connected")
      } catch (error: any) {
        console.error("Erreur de connexion à Supabase:", error)
        setStatus("error")
        setErrorMessage(error.message || "Erreur inconnue")
      }
    }

    testConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test de connexion Supabase</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" && (
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Test de connexion en cours...</span>
          </div>
        )}

        {status === "connected" && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Connexion à Supabase établie avec succès</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col text-red-600">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>Erreur de connexion à Supabase</span>
            </div>
            {errorMessage && <div className="mt-2 text-sm bg-red-50 p-2 rounded">{errorMessage}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

