export interface EvaluationFormData extends FormData {
  get(name: string): string | File | null
  getAll(name: string): (string | File)[]
}

