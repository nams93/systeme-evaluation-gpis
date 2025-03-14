"use server"

export async function fetchEvaluationData() {
  // Simuler une récupération de données
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    totalEvaluations: 120,
    completedEvaluations: 85,
    pendingEvaluations: 35,
    averageScore: 7.8,
  }
}

