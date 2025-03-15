"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { criteresEvaluation } from "@/data/criteres-evaluation"
import { RatingButtons } from "@/components/ui/rating-buttons"

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

  // CHARLY 01 à CHARLY 12
  for (let i = 1; i <= 12; i++) {
    const num = i.toString().padStart(2, "0")
    indicatifs.push({ value: `charly_${num}`, label: `CHARLY ${num}` })
  }

  // ALPHA 01 à ALPHA 17
  for (let i = 1; i <= 17; i++) {
    const num = i.toString().padStart(2, "0")
    indicatifs.push({ value: `alpha_${num}`, label: `ALPHA ${num}` })
  }

  // ECHO 01
  indicatifs.push({ value: "echo_01", label: "ECHO 01" })

  return indicatifs
}

const indicatifs = generateIndicatifs()

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

export function EvaluationForm() {
  const [activeTab, setActiveTab] = useState("savoirs")
  const [evaluations, setEvaluations] = useState<Record<string, number>>({})
  const [observation, setObservation] = useState("")
  const [contexte, setContexte] = useState("")
  const [autreContexte, setAutreContexte] = useState("")
  const [selectedIndicatif, setSelectedIndicatif] = useState("")

  const handleEvaluationChange = (critereId: string, value: number) => {
    setEvaluations((prev) => ({
      ...prev,
      [critereId]: value,
    }))
  }

  const CritereEvaluation = ({
    id,
    libelle,
    description,
  }: {
    id: string
    libelle: string
    description: string
  }) => (
    <div className="space-y-2 pb-6">
      <div className="flex justify-between items-start">
        <div>
          <Label className="text-base font-medium">{libelle}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm font-medium">{evaluations[id] || "0"}/4</span>
      </div>
      <RatingButtons value={evaluations[id] || 0} onChange={(value) => handleEvaluationChange(id, value)} />
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <span>Non observé</span>
        <span>Exceptionnel</span>
      </div>
    </div>
  )

  return (
    <form className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Formulaire d'évaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent">Agent évalué</Label>
              <Input id="agent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select>
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
              <Label htmlFor="matricule">Matricule</Label>
              <Input id="matricule" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicatif">Indicatif de l'évaluateur</Label>
            <Select value={selectedIndicatif} onValueChange={setSelectedIndicatif}>
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

          <div className="space-y-2">
            <Label htmlFor="contexte">Contexte</Label>
            <Select value={contexte} onValueChange={setContexte}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un contexte" />
              </SelectTrigger>
              <SelectContent>
                {contextes.map((ctx) => (
                  <SelectItem key={ctx.value} value={ctx.value}>
                    {ctx.label}
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
              />
            )}
          </div>

          {/* Critères d'évaluation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="savoirs">Savoirs et Connaissances</TabsTrigger>
              <TabsTrigger value="savoirsFaire">Savoirs-Faire</TabsTrigger>
              <TabsTrigger value="savoirsEtre">Savoirs-Être</TabsTrigger>
            </TabsList>

            {["savoirs", "savoirsFaire", "savoirsEtre"].map((categorie) => (
              <TabsContent key={categorie} value={categorie} className="space-y-6">
                {criteresEvaluation
                  .filter((critere) => critere.categorie === categorie)
                  .map((critere) => (
                    <CritereEvaluation
                      key={critere.id}
                      id={critere.id}
                      libelle={critere.libelle}
                      description={critere.description}
                    />
                  ))}
                <div className="space-y-2">
                  <Label htmlFor={`observation-${categorie}`}>Observation générale</Label>
                  <Textarea
                    id={`observation-${categorie}`}
                    placeholder="Ajoutez des remarques..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Annuler</Button>
          <Button>Enregistrer l'évaluation</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

