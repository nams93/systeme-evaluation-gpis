export interface Evaluation {
  id?: number
  agentId: number
  evaluateurId: number
  date: string
  section: number | string
  indicatif: string
  contexte: string
  score: number
  commentaireGeneral: string
  status: string
  notes?: NoteEvaluation[]
}

export interface NoteEvaluation {
  id?: number
  evaluation_id?: number
  critereId: number
  note: number
  commentaire: string
}

