"use server"

import { revalidatePath } from "next/cache"
import type { Evaluation } from "@/types/evaluation"

export async function addEvaluationAction(evaluation: Evaluation) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    }

    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    }

    // Extraire les notes pour les insérer séparément
    const { notes, ...evaluationData } = evaluation

    // Utiliser l'API REST de Supabase directement
    const response = await fetch(`${supabaseUrl}/rest/v1/evaluations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        agent_id: evaluationData.agentId,
        evaluateur_id: evaluationData.evaluateurId,
        date: evaluationData.date,
        section: evaluationData.section,
        indicatif: evaluationData.indicatif,
        contexte: evaluationData.contexte,
        score: evaluationData.score,
        commentaire_general: evaluationData.commentaireGeneral,
        status: evaluationData.status,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erreur lors de l'ajout de l'évaluation:", errorData)
      throw new Error(`Erreur lors de l'ajout de l'évaluation: ${response.statusText}`)
    }

    const data = await response.json()

    // Insérer les notes associées si l'évaluation a été créée avec succès
    if (notes && notes.length > 0 && data && data.length > 0) {
      const notesWithEvalId = notes.map((note) => ({
        evaluation_id: data[0].id,
        critere_id: note.critereId,
        note: note.note,
        commentaire: note.commentaire,
      }))

      const notesResponse = await fetch(`${supabaseUrl}/rest/v1/notes_evaluation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(notesWithEvalId),
      })

      if (!notesResponse.ok) {
        const notesErrorData = await notesResponse.json()
        console.error("Erreur lors de l'ajout des notes:", notesErrorData)
        // On continue même si l'ajout des notes échoue
      }
    }

    // Revalider le chemin du tableau de bord pour mettre à jour les données
    revalidatePath("/dashboard")

    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error("Erreur lors de l'ajout de l'évaluation:", error)
    return {
      success: false,
      error: error.message || "Une erreur s'est produite lors de l'ajout de l'évaluation",
    }
  }
}

