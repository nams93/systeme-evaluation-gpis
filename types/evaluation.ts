export interface Agent {
  id: string
  nom: string
  prenom: string
  matricule: string
  equipe: string
  poste: string
  dateEntree: string
}

export interface Evaluateur {
  id: string
  nom: string
  prenom: string
  fonction: string
}

export interface CritereEvaluation {
  id: string
  section: number // 1-4
  libelle: string
  description: string
  poids: number
}

export interface NoteEvaluation {
  critereId: string
  note: number // 1-5
  commentaire?: string
}

export interface Evaluation {
  id: string
  agentId: string
  evaluateurId: string
  date: string
  notes: NoteEvaluation[]
  commentaireGeneral?: string
  status: "brouillon" | "en_cours" | "completee" | "validee"
}

// Données pour le tableau de bord
export interface StatistiquesSection {
  section: number
  titre: string
  scoreMoyen: number
  progression: number // pourcentage de progression par rapport à la période précédente
  nombreEvaluations: number
}

export interface StatistiquesAgent {
  agentId: string
  nom: string
  prenom: string
  scoreGlobal: number
  scoresParSection: {
    section: number
    score: number
  }[]
  tendance: "hausse" | "stable" | "baisse"
  derniereEvaluation: string
}

