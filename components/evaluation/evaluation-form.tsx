"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agents, evaluateurs, criteres } from "@/data/mock-data"
import type { CritereEvaluation, NoteEvaluation } from "@/types/evaluation"

export function EvaluationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("section-1")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [selectedEvaluateur, setSelectedEvaluateur] = useState("")
  const [notes, setNotes] = useState<NoteEvaluation[]>([])
  const [commentaireGeneral, setCommentaireGeneral] = useState("")

  const handleNoteChange = (critereId: string, note: number) => {
    setNotes((prev) => {
      const existingIndex = prev.findIndex((n) => n.critereId === critereId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], note }
        return updated
      } else {
        return [...prev, { critereId, note }]
      }
    })
  }

  const handleCommentaireChange = (critereId: string, commentaire: string) => {
    setNotes((prev) => {
      const existingIndex = prev.findIndex((n) => n.critereId === critereId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], commentaire }
        return updated
      } else {
        return [...prev, { critereId, note: 0, commentaire }]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous enverriez normalement les données à votre API
    console.log({
      agentId: selectedAgent,
      evaluateurId: selectedEvaluateur,
      date: new Date().toISOString().split("T")[0],
      notes,
      commentaireGeneral,
      status: "completee",
    })

    // Redirection vers le tableau de bord après soumission
    router.push("/dashboard")
  }

  const getCriteresForSection = (section: number): CritereEvaluation[] => {
    return criteres.filter((critere) => critere.section === section)
  }

  const getScoreForSection = (section: number): number => {
    const sectionCriteres = getCriteresForSection(section)
    const sectionNotes = notes.filter((note) => sectionCriteres.some((critere) => critere.id === note.critereId))

    if (sectionNotes.length === 0) return 0

    const sum = sectionNotes.reduce((acc, note) => acc + note.note, 0)
    return sum / sectionNotes.length
  }

  const getTotalScore = (): number => {
    if (notes.length === 0) return 0
    const sum = notes.reduce((acc, note) => acc + note.note, 0)
    return sum / notes.length
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Sélectionnez l'agent à évaluer et l'évaluateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent">Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger id="agent">
                    <SelectValue placeholder="Sélectionner un agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.prenom} {agent.nom} ({agent.matricule})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluateur">Évaluateur</Label>
                <Select value={selectedEvaluateur} onValueChange={setSelectedEvaluateur}>
                  <SelectTrigger id="evaluateur">
                    <SelectValue placeholder="Sélectionner un évaluateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluateurs.map((evaluateur) => (
                      <SelectItem key={evaluateur.id} value={evaluateur.id}>
                        {evaluateur.prenom} {evaluateur.nom} ({evaluateur.fonction})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date d'évaluation</Label>
                <Input id="date" type="date" value={new Date().toISOString().split("T")[0]} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évaluation par section</CardTitle>
            <CardDescription>Évaluez l'agent sur chaque critère (1-5)</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="section-1">Section 1</TabsTrigger>
                <TabsTrigger value="section-2">Section 2</TabsTrigger>
                <TabsTrigger value="section-3">Section 3</TabsTrigger>
                <TabsTrigger value="section-4">Section 4</TabsTrigger>
              </TabsList>

              {[1, 2, 3, 4].map((section) => (
                <TabsContent key={section} value={`section-${section}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Section {section}:{" "}
                        {section === 1
                          ? "Compétences techniques"
                          : section === 2
                            ? "Compétences comportementales"
                            : section === 3
                              ? "Performance opérationnelle"
                              : "Attitude professionnelle"}
                      </h3>
                      <div className="text-sm">
                        Score moyen: <span className="font-bold">{getScoreForSection(section).toFixed(1)}/5</span>
                      </div>
                    </div>

                    {getCriteresForSection(section).map((critere) => (
                      <div key={critere.id} className="border rounded-md p-4 space-y-3">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{critere.libelle}</h4>
                            <p className="text-sm text-muted-foreground">{critere.description}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Button
                                key={value}
                                type="button"
                                variant={
                                  notes.find((n) => n.critereId === critere.id)?.note === value ? "default" : "outline"
                                }
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handleNoteChange(critere.id, value)}
                              >
                                {value}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`commentaire-${critere.id}`}>Commentaire</Label>
                          <Textarea
                            id={`commentaire-${critere.id}`}
                            placeholder="Ajouter un commentaire (optionnel)"
                            value={notes.find((n) => n.critereId === critere.id)?.commentaire || ""}
                            onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commentaire général</CardTitle>
            <CardDescription>Ajoutez un commentaire général sur la performance de l'agent</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Commentaire général sur la performance de l'agent..."
              value={commentaireGeneral}
              onChange={(e) => setCommentaireGeneral(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-lg">
              Score global: <span className="font-bold">{getTotalScore().toFixed(1)}/5</span>
            </div>
            <div className="space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
                Annuler
              </Button>
              <Button type="submit">Soumettre l'évaluation</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}

