import { supabase, createAdminClient } from "@/lib/supabase"
import type { Evaluation } from "@/types/evaluation"

// Récupérer toutes les évaluations
export async function getAllEvaluations() {
  const { data, error } = await supabase
    .from("evaluations")
    .select(`
      *,
      notes_evaluation(*)
    `)
    .order("date", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des évaluations:", error)
    return []
  }

  return data || []
}

// Ajouter une nouvelle évaluation
export async function addEvaluation(evaluation: Evaluation) {
  try {
    // Créer le client admin côté serveur uniquement
    const supabaseAdmin = createAdminClient()

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
      return false
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
      }
    }

    return true
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'évaluation:", error)
    return false
  }
}

// Récupérer les évaluations par section
export async function getEvaluationsBySection(section: number | string) {
  if (section === "all") {
    return getAllEvaluations()
  }

  const { data, error } = await supabase
    .from("evaluations")
    .select(`
      *,
      notes_evaluation(*)
    `)
    .eq("section", section.toString())
    .order("date", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des évaluations par section:", error)
    return []
  }

  return data || []
}

// Récupérer les critères d'évaluation
export async function getCriteresEvaluation() {
  const { data, error } = await supabase
    .from("criteres_evaluation")
    .select("*")
    .order("section", { ascending: true })
    .order("libelle", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des critères:", error)
    return []
  }

  return data || []
}

// Ajouter cette fonction pour récupérer les critères d'évaluation par section
export async function getCriteresEvaluationBySection(section: number | string) {
  let query = supabase
    .from("criteres_evaluation")
    .select("*")
    .order("categorie", { ascending: true })
    .order("libelle", { ascending: true })

  // Si une section spécifique est demandée
  if (section !== "all" && section !== 0) {
    query = query.or(`section.eq.0,section.eq.${section}`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erreur lors de la récupération des critères par section:", error)
    return []
  }

  return data || []
}

// Récupérer les agents
export async function getAgents() {
  const { data, error } = await supabase.from("agents").select("*").order("nom", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des agents:", error)
    return []
  }

  return data || []
}

// Récupérer les évaluateurs
export async function getEvaluateurs() {
  const { data, error } = await supabase.from("evaluateurs").select("*").order("nom", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des évaluateurs:", error)
    return []
  }

  return data || []
}

// Ajouter un agent
export async function addAgent(agent: {
  nom: string
  prenom: string
  matricule: string
  equipe?: string
  poste?: string
  dateEntree?: string
}) {
  try {
    const supabaseAdmin = createAdminClient()

    const { data, error } = await supabaseAdmin
      .from("agents")
      .insert([
        {
          nom: agent.nom,
          prenom: agent.prenom,
          matricule: agent.matricule,
          equipe: agent.equipe,
          poste: agent.poste,
          date_entree: agent.dateEntree,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de l'ajout de l'agent:", error)
      return null
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'agent:", error)
    return null
  }
}

// Ajouter un évaluateur
export async function addEvaluateur(evaluateur: {
  nom: string
  prenom: string
  fonction?: string
}) {
  try {
    const supabaseAdmin = createAdminClient()

    const { data, error } = await supabaseAdmin
      .from("evaluateurs")
      .insert([
        {
          nom: evaluateur.nom,
          prenom: evaluateur.prenom,
          fonction: evaluateur.fonction,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de l'ajout de l'évaluateur:", error)
      return null
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'évaluateur:", error)
    return null
  }
}

