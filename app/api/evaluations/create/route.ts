import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Evaluation } from "@/types/evaluation"

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json({ success: false, error: "NEXT_PUBLIC_SUPABASE_URL is not defined" }, { status: 500 })
    }

    if (!supabaseServiceKey) {
      return NextResponse.json({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY is not defined" }, { status: 500 })
    }

    // Créer un client Supabase avec la clé de service
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Récupérer les données de l'évaluation
    const evaluation = (await request.json()) as Evaluation

    // Extraire les notes pour les insérer séparément
    const { notes, ...evaluationData } = evaluation

    // Insérer l'évaluation
    const { data, error } = await supabaseAdmin
      .from("evaluations")
      .insert([
        {
          agent_id: evaluationData.agentId,
          evaluateur_id: evaluationData.evaluateurId,
          date: evaluationData.date,
          section: evaluationData.section,
          indicatif: evaluationData.indicatif,
          contexte: evaluationData.contexte,
          score: evaluationData.score,
          commentaire_general: evaluationData.commentaireGeneral,
          status: evaluationData.status,
        },
      ])
      .select()

    if (error || !data || data.length === 0) {
      console.error("Erreur lors de l'ajout de l'évaluation:", error)
      return NextResponse.json(
        { success: false, error: error?.message || "Erreur lors de l'ajout de l'évaluation" },
        { status: 400 },
      )
    }

    // Insérer les notes associées
    if (notes && notes.length > 0) {
      const notesWithEvalId = notes.map((note) => ({
        evaluation_id: data[0].id,
        critere_id: note.critereId,
        note: note.note,
        commentaire: note.commentaire,
      }))

      const { error: notesError } = await supabaseAdmin.from("notes_evaluation").insert(notesWithEvalId)

      if (notesError) {
        console.error("Erreur lors de l'ajout des notes:", notesError)
        // On continue même si l'ajout des notes échoue
      }
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error: any) {
    console.error("Erreur lors de l'ajout de l'évaluation:", error)
    return NextResponse.json({ success: false, error: error.message || "Une erreur s'est produite" }, { status: 500 })
  }
}

