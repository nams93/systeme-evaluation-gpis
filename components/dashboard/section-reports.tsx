"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { statistiquesSections } from "@/data/mock-data"
import { BarChart, FileText, Download, Printer } from "lucide-react"

export function SectionReports() {
  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Rapports par section</CardTitle>
        <CardDescription>Générez des rapports détaillés pour chaque section d'évaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statistiquesSections.map((section) => (
            <Card key={section.section} className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Section {section.section}: {section.titre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Rapport détaillé
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Analyse comparative
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter (PDF)
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

