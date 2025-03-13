"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface EvaluationFormProps {
  onSubmit: (formData: any) => void
}

export default function EvaluationForm({ onSubmit }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    agent: "",
    section: "",
    matricule: "",
    indicatif: "",
    // Savoirs et Connaissances
    connaissances_juridiques: 0,
    connaissance_structure: 0,
    connaissance_patrimoine: 0,
    // Savoirs-Faire
    transmissions: 0,
    vigilance: 0,
    deplacement: 0,
    distances: 0,
    positionnement: 0,
    contact: 0,
    stress: 0,
    participation: 0,
    // Savoirs-Être
    maitrise: 0,
    equipements: 0,
    tenue: 0,
    proprete: 0,
    vehicule: 0,
    comportement: 0,
    exemplarite: 0,
    motivation: 0,
    interaction: 0,
    hierarchie: 0,
    // Observation
    observation: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData({
      ...formData,
      [field]: value[0],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculer les moyennes par catégorie
    const savoirsConnaissances = (
      (formData.connaissances_juridiques + formData.connaissance_structure + formData.connaissance_patrimoine) /
      3
    ).toFixed(2)

    const savoirsFaire = (
      (formData.transmissions +
        formData.vigilance +
        formData.deplacement +
        formData.distances +
        formData.positionnement +
        formData.contact +
        formData.stress +
        formData.participation) /
      8
    ).toFixed(2)

    const savoirsEtre = (
      (formData.maitrise +
        formData.equipements +
        formData.tenue +
        formData.proprete +
        formData.vehicule +
        formData.comportement +
        formData.exemplarite +
        formData.motivation +
        formData.interaction +
        formData.hierarchie) /
      10
    ).toFixed(2)

    const moyenneGenerale = ((Number(savoirsConnaissances) + Number(savoirsFaire) + Number(savoirsEtre)) / 3).toFixed(2)

    // Ajouter les moyennes et la date de création au formData
    const evaluationData = {
      ...formData,
      savoirsConnaissances,
      savoirsFaire,
      savoirsEtre,
      moyenneGenerale,
      dateCreation: new Date().toISOString(),
    }

    // Générer un PDF si nécessaire
    generatePDF(evaluationData)

    // Envoyer les données au parent
    onSubmit(evaluationData)
  }

  const generatePDF = (data) => {
    const doc = new jsPDF()

    // Titre
    doc.setFontSize(18)
    doc.text("ÉVALUATION AGENT D'EXPLOITATION", 105, 20, { align: "center" })

    // Informations de base
    doc.setFontSize(12)
    doc.text(`Date: ${data.date}`, 20, 40)
    doc.text(`Agent évalué: ${data.agent}`, 20, 50)
    doc.text(`Section: ${data.section}`, 20, 60)
    doc.text(`Matricule: ${data.matricule}`, 20, 70)
    doc.text(`Indicatif: ${data.indicatif}`, 20, 80)

    // Tableau des compétences
    doc.setFontSize(14)
    doc.text("Évaluation des compétences", 105, 100, { align: "center" })

    const tableData = [
      ["Savoirs et Connaissances", data.savoirsConnaissances],
      ["Connaissances Juridiques", data.connaissances_juridiques],
      ["Connaissance de la structure", data.connaissance_structure],
      ["Connaissance du patrimoine", data.connaissance_patrimoine],
      ["Savoirs-Faire", data.savoirsFaire],
      ["Transmissions", data.transmissions],
      ["Vigilance", data.vigilance],
      ["Déplacement", data.deplacement],
      ["Distances", data.distances],
      ["Positionnement", data.positionnement],
      ["Contact", data.contact],
      ["Gestion du stress", data.stress],
      ["Participation", data.participation],
      ["Savoirs-Être", data.savoirsEtre],
      ["Maîtrise", data.maitrise],
      ["Équipements", data.equipements],
      ["Tenue", data.tenue],
      ["Propreté", data.proprete],
      ["Véhicule", data.vehicule],
      ["Comportement", data.comportement],
      ["Exemplarité", data.exemplarite],
      ["Motivation", data.motivation],
      ["Interaction", data.interaction],
      ["Hiérarchie", data.hierarchie],
      ["Moyenne Générale", data.moyenneGenerale],
    ]

    doc.autoTable({
      startY: 110,
      head: [["Compétence", "Note"]],
      body: tableData,
    })

    // Observation
    if (data.observation) {
      doc.setFontSize(14)
      doc.text("Observation générale", 20, doc.autoTable.previous.finalY + 20)
      doc.setFontSize(12)
      doc.text(data.observation, 20, doc.autoTable.previous.finalY + 30)
    }

    // Enregistrer le PDF
    doc.save(`evaluation_${data.agent}_${data.date}.pdf`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulaire d'évaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Agent évalué</Label>
              <Input
                id="agent"
                value={formData.agent}
                onChange={(e) => handleChange("agent", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(value) => handleChange("section", value)} required>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Sélectionner une section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Section 1">Section 1</SelectItem>
                  <SelectItem value="Section 2">Section 2</SelectItem>
                  <SelectItem value="Section 3">Section 3</SelectItem>
                  <SelectItem value="Section 4">Section 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule</Label>
              <Input
                id="matricule"
                value={formData.matricule}
                onChange={(e) => handleChange("matricule", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indicatif">Indicatif</Label>
              <Select value={formData.indicatif} onValueChange={(value) => handleChange("indicatif", value)} required>
                <SelectTrigger id="indicatif">
                  <SelectValue placeholder="Sélectionner un indicatif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>CHARLY</SelectLabel>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={`charly-${i + 1}`} value={`CHARLY ${(i + 1).toString().padStart(2, "0")}`}>
                        CHARLY {(i + 1).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>ALPHA</SelectLabel>
                    {[...Array(17)].map((_, i) => (
                      <SelectItem key={`alpha-${i + 1}`} value={`ALPHA ${(i + 1).toString().padStart(2, "0")}`}>
                        ALPHA {(i + 1).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="savoirs" className="mt-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="savoirs">Savoirs et Connaissances</TabsTrigger>
              <TabsTrigger value="savoir-faire">Savoirs-Faire</TabsTrigger>
              <TabsTrigger value="savoir-etre">Savoirs-Être</TabsTrigger>
            </TabsList>

            <TabsContent value="savoirs" className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="connaissances_juridiques">Connaissances Juridiques</Label>
                  <span className="font-medium">{formData.connaissances_juridiques}/4</span>
                </div>
                <Slider
                  id="connaissances_juridiques"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.connaissances_juridiques]}
                  onValueChange={(val) => handleSliderChange("connaissances_juridiques", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="connaissance_structure">Connaissance de la structure</Label>
                  <span className="font-medium">{formData.connaissance_structure}/4</span>
                </div>
                <Slider
                  id="connaissance_structure"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.connaissance_structure]}
                  onValueChange={(val) => handleSliderChange("connaissance_structure", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="connaissance_patrimoine">Connaissance du patrimoine</Label>
                  <span className="font-medium">{formData.connaissance_patrimoine}/4</span>
                </div>
                <Slider
                  id="connaissance_patrimoine"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.connaissance_patrimoine]}
                  onValueChange={(val) => handleSliderChange("connaissance_patrimoine", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="savoir-faire" className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="transmissions">Modulation et qualité des compte-rendus radio</Label>
                  <span className="font-medium">{formData.transmissions}/4</span>
                </div>
                <Slider
                  id="transmissions"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.transmissions]}
                  onValueChange={(val) => handleSliderChange("transmissions", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="vigilance">Attitude et vigilance lors de la mission</Label>
                  <span className="font-medium">{formData.vigilance}/4</span>
                </div>
                <Slider
                  id="vigilance"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.vigilance]}
                  onValueChange={(val) => handleSliderChange("vigilance", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="deplacement">Déplacement dans le dispositif</Label>
                  <span className="font-medium">{formData.deplacement}/4</span>
                </div>
                <Slider
                  id="deplacement"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.deplacement]}
                  onValueChange={(val) => handleSliderChange("deplacement", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="distances">Distances de sécurité</Label>
                  <span className="font-medium">{formData.distances}/4</span>
                </div>
                <Slider
                  id="distances"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.distances]}
                  onValueChange={(val) => handleSliderChange("distances", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="positionnement">Positionnement</Label>
                  <span className="font-medium">{formData.positionnement}/4</span>
                </div>
                <Slider
                  id="positionnement"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.positionnement]}
                  onValueChange={(val) => handleSliderChange("positionnement", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contact">Prise de contact</Label>
                  <span className="font-medium">{formData.contact}/4</span>
                </div>
                <Slider
                  id="contact"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.contact]}
                  onValueChange={(val) => handleSliderChange("contact", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stress">Gestion du stress</Label>
                  <span className="font-medium">{formData.stress}/4</span>
                </div>
                <Slider
                  id="stress"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.stress]}
                  onValueChange={(val) => handleSliderChange("stress", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="participation">Participe à la préparation des missions</Label>
                  <span className="font-medium">{formData.participation}/4</span>
                </div>
                <Slider
                  id="participation"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.participation]}
                  onValueChange={(val) => handleSliderChange("participation", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="savoir-etre" className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maitrise">Maîtrise et sang-froid</Label>
                  <span className="font-medium">{formData.maitrise}/4</span>
                </div>
                <Slider
                  id="maitrise"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.maitrise]}
                  onValueChange={(val) => handleSliderChange("maitrise", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="equipements">Soin et entretien des équipements en dotation</Label>
                  <span className="font-medium">{formData.equipements}/4</span>
                </div>
                <Slider
                  id="equipements"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.equipements]}
                  onValueChange={(val) => handleSliderChange("equipements", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="tenue">Port de la tenue réglementaire et homogénéité</Label>
                  <span className="font-medium">{formData.tenue}/4</span>
                </div>
                <Slider
                  id="tenue"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.tenue]}
                  onValueChange={(val) => handleSliderChange("tenue", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="proprete">Propreté de la tenue et des rangers</Label>
                  <span className="font-medium">{formData.proprete}/4</span>
                </div>
                <Slider
                  id="proprete"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.proprete]}
                  onValueChange={(val) => handleSliderChange("proprete", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="vehicule">Soin et maintien de la propreté au sein du véhicule</Label>
                  <span className="font-medium">{formData.vehicule}/4</span>
                </div>
                <Slider
                  id="vehicule"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.vehicule]}
                  onValueChange={(val) => handleSliderChange("vehicule", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="comportement">Comportement et attitude - Code de déontologie</Label>
                  <span className="font-medium">{formData.comportement}/4</span>
                </div>
                <Slider
                  id="comportement"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.comportement]}
                  onValueChange={(val) => handleSliderChange("comportement", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="exemplarite">Exemplarité</Label>
                  <span className="font-medium">{formData.exemplarite}/4</span>
                </div>
                <Slider
                  id="exemplarite"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.exemplarite]}
                  onValueChange={(val) => handleSliderChange("exemplarite", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="motivation">Motivation et implication</Label>
                  <span className="font-medium">{formData.motivation}/4</span>
                </div>
                <Slider
                  id="motivation"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.motivation]}
                  onValueChange={(val) => handleSliderChange("motivation", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interaction">Communication avec le public - Politesse - Courtoisie</Label>
                  <span className="font-medium">{formData.interaction}/4</span>
                </div>
                <Slider
                  id="interaction"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.interaction]}
                  onValueChange={(val) => handleSliderChange("interaction", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="hierarchie">
                    Communication au sein de la patrouille / Rapports avec la hiérarchie
                  </Label>
                  <span className="font-medium">{formData.hierarchie}/4</span>
                </div>
                <Slider
                  id="hierarchie"
                  min={0}
                  max={4}
                  step={1}
                  value={[formData.hierarchie]}
                  onValueChange={(val) => handleSliderChange("hierarchie", val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Non observé</span>
                  <span>Exceptionnel</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="observation">Observation générale</Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => handleChange("observation", e.target.value)}
              placeholder="Ajoutez des remarques..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer l'évaluation</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

