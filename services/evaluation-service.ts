export function getAllEvaluations() {
  try {
    const evaluations = localStorage.getItem("evaluations")
    return evaluations ? JSON.parse(evaluations) : []
  } catch (error) {
    console.error("Error getting evaluations from localStorage:", error)
    return []
  }
}

