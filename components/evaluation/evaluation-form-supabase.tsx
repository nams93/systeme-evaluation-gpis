"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Options pour les sections (sans VAP)
const sections = [
  { value: "1", label: "Section 1" },
  { value: "2", label: "Section 2" },
  { value: "3", label: "Section 3" },
  { value: "4", label: "Section 4" },
]

// Génération des indicatifs
const generateIndicatifs = () => {
  const indicatifs = []

  // GOLF 01 à GOLF 20
  for (let i = 1; i <= 20; i++) {
    const num = i.toString().padStart(2, "0")
    indicatifs.push({ value: `golf_${num}`, label: `GOLF ${num}` })
  }

  // Alpha 01 à Alpha 17
  for (let i = 1; i <= 17; i++) {
    const num = i.toString().padStart(2, "0")
    indicatifs.push({ value: `alpha_${num}`, label: `Alpha ${num}` })
  }

  // CHARLY 01 à CHARLY 10
  for (let i = 1; i <= 10; i++) {
    const num = i.toString().padStart(2, "0")
    indicatifs.push({ value: `charly_${num}`, label: `CHARLY ${num}` })
  }

  return indicatifs
}

const indicatifs = generateIndicatifs()

// Options pour les contextes
const contextes = [
  { value: "ronde", label: "RONDE" },
  { value: "intervention", label: "INTERVENTION" },
  { value: "ronde_ciblee", label: "RONDE CIBLEE" },
  { value: "ronde_renforcee", label: "RONDE RENFORCEE" },
  { value: "ronde_generale", label: "RONDE GENERALE" },
  { value: "operation_securisation", label: "OPERATION DE SECURISATION" },
  { value: "operation_conjointe", label: "OPERATION CONJOINTE / COORDONNEE" },
  { value: "code_noir", label: "CODE NOIR" },
  { value: "code_rouge", label: "CODE ROUGE" },
  { value: "procedure_judiciaire", label: "PROCEDURE JUDICIAIRE" },
  { value: "decouverte", label: "DECOUVERTE" },
  { value: "assistance_secours", label: "ASSISTANCE SECOURS A VICTIME" },
  { value: "incendie", label: "INCENDIE" },
  { value: "autre", label: "AUTRE (PRECISER)" },
]

// Composant pour le curseur d'évaluation amélioré
function RatingSlider({
  value,
  onChange,
  label,
  description,
}: {
  value: number
  onChange: (value: number) => void
  label: string
  description?: string
}) {
  const ratings = [
    { value: 0, label: "Non maîtrisé" },
    { value: 1, label: "En cours d'acquisition" },
    { value: 2, label: "Partiellement acquis" },
    { value: 3, label: "Maîtrisé" },
    { value: 4, label: "Parfaitement maîtrisé" },
  ]

  // Couleurs pour les différents niveaux
  const getButtonColor = (ratingValue: number) => {
    if (value !== ratingValue) return "bg-gray-100 hover:bg-gray-200 text-gray-700"

    switch (ratingValue) {
      case 0:
        return "bg-red-500 text-white"
      case 1:
        return "bg-orange-500 text-white"
      case 2:
        return "bg-yellow-500 text-white"
      case 3:
        return "bg-blue-500 text-white"
      case 4:
        return "bg-green-600 text-white"
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }
  }

  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex flex-col">
        <span className="text-base font-semibold">{label}</span>
        {description && <span className="text-sm text-muted-foreground mt-1">{description}</span>}
        <div className="flex justify-end">
          <span
            className={`text-sm font-medium px-2 py-1 rounded-md ${
              value === 0
                ? "bg-red-50 text-red-700"
                : value === 1
                  ? "bg-orange-50 text-orange-700"
                  : value === 2
                    ? "bg-yellow-50 text-yellow-700"
                    : value === 3
                      ? "bg-blue-50 text-blue-700"
                      : value === 4
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-700"
            }`}
          >
            {ratings.find((r) => r.value === value)?.label || "Non évalué"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {ratings.map((rating) => (
          <button
            key={rating.value}
            type="button"
            onClick={() => onChange(rating.value)}
            className={`flex-1 p-3 rounded-lg transition-all ${getButtonColor(rating.value)} ${
              value === rating.value ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              ringColor:
                value === 0
                  ? "#ef4444"
                  : value === 1
                    ? "#f97316"
                    : value === 2
                      ? "#eab308"
                      : value === 3
                        ? "#3b82f6"
                        : value === 4
                          ? "#16a34a"
                          : "#d1d5db",
            }}
          >
            {rating.value}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>NON OBSERVE</span>
        <span>EXCEPTIONNEL</span>
      </div>
    </div>
  )
}

export function EvaluationFormSupabase() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("savoirs")
  const [evaluations, setEvaluations] = useState<Record<string, number>>({})
  const [observation, setObservation] = useState("")
  const [contexte, setContexte] = useState("")
  const [autreContexte, setAutreContexte] = useState("")
  const [selectedIndicatif, setSelectedIndicatif] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [agentName, setAgentName] = useState("")
  const [evaluateurName, setEvaluateurName] = useState("")
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEvaluationChange = (critereId: string, value: number) => {
    setEvaluations((prev) => ({
      ...prev,
      [critereId]: value,
    }))
  }

  const calculateFinalScore = () => {
    const scores = Object.values(evaluations)
    if (scores.length === 0) return 0

    // Calculer la moyenne sur 4 puis convertir sur 20
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return (average * 20) / 4
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const finalScore = calculateFinalScore()

      // Créer l'objet d'évaluation
      const evaluationData = {
        agentId: 1, // Temporaire, à remplacer par l'ID réel de l'agent
        evaluateurId: 1, // Temporaire, à remplacer par l'ID réel de l'évaluateur
        date: evaluationDate,
        section: selectedSection,
        indicatif: selectedIndicatif,
        contexte: contexte === "autre" ? autreContexte : contextes.find((c) => c.value === contexte)?.label,
        score: finalScore,
        notes: Object.entries(evaluations).map(([critereId, note]) => ({
          critereId,
          note,
          commentaire: "",
        })),
        commentaireGeneral: observation,
        status: "completee" as const,
      }

      // Utiliser une API route pour contourner les problèmes d'accès aux variables d'environnement
      const response = await fetch("/api/evaluations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Échec de l'enregistrement")
      }

      const result = await response.json()

      toast({
        title: "Évaluation enregistrée",
        description: "L'évaluation a été enregistrée avec succès.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'évaluation:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de l'évaluation.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-blue-900">
      {/* Motif de fond */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 p-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
            <CardTitle>Formulaire d'évaluation GPIS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Première ligne: Date et Agent évalué */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent">Agent évalué</Label>
                <Input
                  id="agent"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Nom de l'agent"
                  required
                />
              </div>
            </div>

            {/* Deuxième ligne: Section et Évaluateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluateur">Évaluateur</Label>
                <Input
                  id="evaluateur"
                  value={evaluateurName}
                  onChange={(e) => setEvaluateurName(e.target.value)}
                  placeholder="Nom de l'évaluateur"
                  required
                />
              </div>
            </div>

            {/* Troisième ligne: Indicatif */}
            <div className="space-y-2">
              <Label htmlFor="indicatif">Indicatif</Label>
              <Select value={selectedIndicatif} onValueChange={setSelectedIndicatif} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un indicatif" />
                </SelectTrigger>
                <SelectContent>
                  {indicatifs.map((indicatif) => (
                    <SelectItem key={indicatif.value} value={indicatif.value}>
                      {indicatif.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quatrième ligne: Contexte */}
            <div className="space-y-2">
              <Label htmlFor="contexte">Contexte de l'évaluation</Label>
              <Select value={contexte} onValueChange={setContexte} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contexte" />
                </SelectTrigger>
                <SelectContent>
                  {contextes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contexte === "autre" && (
                <Input
                  className="mt-2"
                  placeholder="Précisez le contexte"
                  value={autreContexte}
                  onChange={(e) => setAutreContexte(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Onglets pour les différentes catégories */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="savoirs">SAVOIRS ET CONNAISSANCES</TabsTrigger>
                <TabsTrigger value="savoirsFaire">SAVOIRS-FAIRE</TabsTrigger>
                <TabsTrigger value="savoirsEtre">SAVOIRS-ÊTRE</TabsTrigger>
              </TabsList>

              <TabsContent value="savoirs" className="space-y-6 pt-4">
                <RatingSlider
                  value={evaluations["connaissance_juridique"] || 0}
                  onChange={(value) => handleEvaluationChange("connaissance_juridique", value)}
                  label="CONNAISSANCES JURIDIQUES"
                  description="EVALUER LES CONNAISSANCES JURIDIQUES DE L'AGENT AU REGARD DES ARTICLES DU CP - CPP - CSI - CCH"
                />
                <RatingSlider
                  value={evaluations["connaissance_structure"] || 0}
                  onChange={(value) => handleEvaluationChange("connaissance_structure", value)}
                  label="CONNAISSANCE DE LA STRUCTURE"
                  description="ORGANISATION FONCTIONNELLE DU GPIS - ORGANISATION OPERATIONNELLE - CADRE D'ACTION - ETC..."
                />
                <RatingSlider
                  value={evaluations["connaissance_patrimoine"] || 0}
                  onChange={(value) => handleEvaluationChange("connaissance_patrimoine", value)}
                  label="CONNAISSANCE DU PATRIMOINE"
                  description="LES BAILLEURS - LES PARTIES COMMUNES - BAPTEME DU PATRIMOINE - ETC..."
                />
              </TabsContent>

              <TabsContent value="savoirsFaire" className="space-y-6 pt-4">
                <div className="text-sm font-medium text-blue-700 mb-4 bg-blue-50 p-2 rounded">
                  CONNAISSANCES TECHNIQUES NECESSAIRES
                </div>
                <RatingSlider
                  value={evaluations["transmissions"] || 0}
                  onChange={(value) => handleEvaluationChange("transmissions", value)}
                  label="TRANSMISSIONS"
                  description="MODULATION ET QUALITE DES COMPTE-RENDUS RADIO"
                />
                <RatingSlider
                  value={evaluations["vigilance"] || 0}
                  onChange={(value) => handleEvaluationChange("vigilance", value)}
                  label="VIGILANCE"
                  description="ATTITUDE ET VIGILANCE LORS DE LA MISSION"
                />
                <RatingSlider
                  value={evaluations["deplacement"] || 0}
                  onChange={(value) => handleEvaluationChange("deplacement", value)}
                  label="DEPLACEMENT"
                  description="DEPLACEMENT DANS LE DISPOSITIF"
                />
                <RatingSlider
                  value={evaluations["distances"] || 0}
                  onChange={(value) => handleEvaluationChange("distances", value)}
                  label="DISTANCES"
                  description="DISTANCES DE SECURITE"
                />
                <RatingSlider
                  value={evaluations["positionnement"] || 0}
                  onChange={(value) => handleEvaluationChange("positionnement", value)}
                  label="POSITIONNEMENT"
                />
                <RatingSlider
                  value={evaluations["contact"] || 0}
                  onChange={(value) => handleEvaluationChange("contact", value)}
                  label="CONTACT"
                  description="PRISE DE CONTACT"
                />
                <RatingSlider
                  value={evaluations["stress"] || 0}
                  onChange={(value) => handleEvaluationChange("stress", value)}
                  label="STRESS"
                  description="GESTION DU STRESS"
                />
                <RatingSlider
                  value={evaluations["participation"] || 0}
                  onChange={(value) => handleEvaluationChange("participation", value)}
                  label="PARTICIPATION"
                  description="PARTICIPE A LA PREPARATION DES MISSIONS"
                />
              </TabsContent>

              <TabsContent value="savoirsEtre" className="space-y-6 pt-4">
                <RatingSlider
                  value={evaluations["maitrise"] || 0}
                  onChange={(value) => handleEvaluationChange("maitrise", value)}
                  label="MAITRISE"
                  description="MAITRISE ET SANG-FROID"
                />
                <RatingSlider
                  value={evaluations["equipements"] || 0}
                  onChange={(value) => handleEvaluationChange("equipements", value)}
                  label="EQUIPEMENTS"
                  description="SOIN ET ENTRETIEN DES EQUIPEMENTS EN DOTATION"
                />
                <RatingSlider
                  value={evaluations["tenue"] || 0}
                  onChange={(value) => handleEvaluationChange("tenue", value)}
                  label="TENUE"
                  description="PORT DE LA TENUE REGLEMENTAIRE ET HOMOGENEITE AU SEIN DE LA PATROUILLE"
                />
                <RatingSlider
                  value={evaluations["proprete"] || 0}
                  onChange={(value) => handleEvaluationChange("proprete", value)}
                  label="PROPRETE"
                  description="PROPRETE DE LA TENUE ET DES RANGERS"
                />
                <RatingSlider
                  value={evaluations["vehicule"] || 0}
                  onChange={(value) => handleEvaluationChange("vehicule", value)}
                  label="VEHICULE"
                  description="SOIN ET MAINTIEN DE LA PROPRETE AU SEIN DU VEHICULE"
                />
                <RatingSlider
                  value={evaluations["comportement"] || 0}
                  onChange={(value) => handleEvaluationChange("comportement", value)}
                  label="COMPORTEMENT"
                  description="COMPORTEMENT ET ATTITUDE - CODE DE DEONTOLOGIE"
                />
                <RatingSlider
                  value={evaluations["exemplarite"] || 0}
                  onChange={(value) => handleEvaluationChange("exemplarite", value)}
                  label="EXEMPLARITE"
                />
                <RatingSlider
                  value={evaluations["motivation"] || 0}
                  onChange={(value) => handleEvaluationChange("motivation", value)}
                  label="MOTIVATION"
                  description="MOTIVATION ET IMPLICATION"
                />
                <RatingSlider
                  value={evaluations["interaction"] || 0}
                  onChange={(value) => handleEvaluationChange("interaction", value)}
                  label="INTERACTION"
                  description="COMMUNICATION AVEC LE PUBLIC - POLITESSE - COURTOISIE"
                />
                <RatingSlider
                  value={evaluations["hierarchie"] || 0}
                  onChange={(value) => handleEvaluationChange("hierarchie", value)}
                  label="HIERARCHIE"
                  description="COMMUNICATION AU SEIN DE LA PATROUILLE / RAPPORTS AVEC LA HIERARCHIE"
                />
              </TabsContent>
            </Tabs>

            {/* Observation générale */}
            <div className="space-y-2">
              <Label htmlFor="observation">Observation générale</Label>
              <Textarea
                id="observation"
                placeholder="Ajoutez des remarques..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard")} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer l'évaluation"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}