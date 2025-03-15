import { supabase } from "@/lib/supabase"
import { getAllEvaluations as getLocalEvaluations } from "@/services/evaluation-service"

export async function migrateLocalDataToSupabase() {
  try {
    // 1. Récupérer les données du localStorage
    const localEvaluations = getLocalEvaluations()

    if (localEvaluations.length === 0) {
      console.log("Aucune donnée locale à migrer")
      return { success: true, message: "Aucune donnée locale à migrer" }
    }

    // 2. Pour chaque évaluation
    let successCount = 0
    let errorCount = 0

    for (const evaluation of localEvaluations) {
      // Créer l'agent s'il n'existe pas déjà
      let agentId = null
      if (evaluation.agent) {
        // Vérifier si l'agent existe déjà
        const { data: existingAgents } = await supabase
          .from("agents")
          .select("id")
          .eq("matricule", evaluation.matricule || "INCONNU")
          .limit(1)

        if (existingAgents && existingAgents.length > 0) {
          agentId = existingAgents[0].id
        } else {
          // Créer l'agent
          const [nom, prenom] = (evaluation.agent || "").split(" ").reverse()
          const { data: newAgent, error: agentError } = await supabase
            .from("agents")
            .insert([
              {
                nom: nom || "Inconnu",
                prenom: prenom || "",
                matricule: evaluation.matricule || `INCONNU-${Date.now()}`,
                equipe: evaluation.section ? `Section ${evaluation.section}` : "Inconnue",
              },
            ])
            .select()

          if (agentError) {
            console.error("Erreur lors de la création de l'agent:", agentError)
            continue
          }

          agentId = newAgent?.[0]?.id
        }
      }

      // Créer l'évaluateur s'il n'existe pas déjà
      let evaluateurId = null
      if (evaluation.indicatif) {
        // Vérifier si l'évaluateur existe déjà
        const { data: existingEvaluateurs } = await supabase
          .from("evaluateurs")
          .select("id")
          .eq("fonction", evaluation.indicatif)
          .limit(1)

        if (existingEvaluateurs && existingEvaluateurs.length > 0) {
          evaluateurId = existingEvaluateurs[0].id
        } else {
          // Créer l'évaluateur
          const { data: newEvaluateur, error: evaluateurError } = await supabase
            .from("evaluateurs")
            .insert([
              {
                nom: evaluation.indicatif || "Inconnu",
                prenom: "",
                fonction: evaluation.indicatif,
              },
            ])
            .select()

          if (evaluateurError) {
            console.error("Erreur lors de la création de l'évaluateur:", evaluateurError)
            continue
          }

          evaluateurId = newEvaluateur?.[0]?.id
        }
      }

      // Insérer l'évaluation
      const { data: newEvaluation, error: evalError } = await supabase
        .from("evaluations")
        .insert([
          {
            agent_id: agentId,
            evaluateur_id: evaluateurId,
            date: evaluation.date,
            section: evaluation.section,
            indicatif: evaluation.indicatif,
            contexte: evaluation.contexte,
            score: evaluation.score,
            commentaire_general: evaluation.commentaireGeneral,
            status: evaluation.status || "completee",
          },
        ])
        .select()

      if (evalError) {
        console.error("Erreur lors de la migration de l'évaluation:", evalError)
        errorCount++
        continue
      }

      // Insérer les notes si elles existent
      if (evaluation.notes && evaluation.notes.length > 0 && newEvaluation?.[0]?.id) {
        const notesToInsert = evaluation.notes.map((note) => ({
          evaluation_id: newEvaluation[0].id,
          critere_id: note.critereId, // Attention: les IDs peuvent être différents dans Supabase
          note: note.note,
          commentaire: note.commentaire,
        }))

        const { error: notesError } = await supabase.from("notes_evaluation").insert(notesToInsert)

        if (notesError) {
          console.error("Erreur lors de la migration des notes:", notesError)
        }
      }

      successCount++
    }

    return {
      success: true,
      message: `Migration terminée: ${successCount} évaluations migrées, ${errorCount} erreurs`,
    }
  } catch (error) {
    console.error("Erreur lors de la migration des données:", error)
    return {
      success: false,
      message: `Erreur lors de la migration: ${error}`,
    }
  }
}

