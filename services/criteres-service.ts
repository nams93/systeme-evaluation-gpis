import { supabase } from "@/lib/supabase"
import { criteresEvaluation } from "@/data/criteres-evaluation"

// Fonction pour initialiser les critères d'évaluation dans Supabase
export async function initializeCriteres() {
  try {
    // Vérifier si des critères existent déjà
    const { data: existingCriteres, error: checkError } = await supabase
      .from("criteres_evaluation")
      .select("id")
      .limit(1)

    if (checkError) {
      console.error("Erreur lors de la vérification des critères:", checkError)
      return false
    }

    // Si des critères existent déjà, ne pas réinitialiser
    if (existingCriteres && existingCriteres.length > 0) {
      console.log("Les critères d'évaluation existent déjà dans la base de données")
      return true
    }

    // Insérer les critères d'évaluation
    const { error: insertError } = await supabase.from("criteres_evaluation").insert(
      criteresEvaluation.map((critere) => ({
        id: critere.id,
        section: critere.section,
        libelle: critere.libelle,
        description: critere.description,
        categorie: critere.categorie,
        poids: critere.poids,
      })),
    )

    if (insertError) {
      console.error("Erreur lors de l'initialisation des critères:", insertError)
      return false
    }

    console.log("Critères d'évaluation initialisés avec succès")
    return true
  } catch (error) {
    console.error("Erreur lors de l'initialisation des critères:", error)
    return false
  }
}

// Fonction pour récupérer tous les critères
export async function getAllCriteres() {
  const { data, error } = await supabase
    .from("criteres_evaluation")
    .select("*")
    .order("categorie", { ascending: true })
    .order("libelle", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des critères:", error)
    return []
  }

  return data || []
}

// Fonction pour récupérer les critères par catégorie
export async function getCriteresByCategorie(categorie: string) {
  const { data, error } = await supabase
    .from("criteres_evaluation")
    .select("*")
    .eq("categorie", categorie)
    .order("libelle", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des critères par catégorie:", error)
    return []
  }

  return data || []
}

// Fonction pour récupérer les critères par section
export async function getCriteresBySection(section: number) {
  const { data, error } = await supabase
    .from("criteres_evaluation")
    .select("*")
    .or(`section.eq.0,section.eq.${section}`)
    .order("categorie", { ascending: true })
    .order("libelle", { ascending: true })

  if (error) {
    console.error("Erreur lors de la récupération des critères par section:", error)
    return []
  }

  return data || []
}

