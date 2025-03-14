"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statistiquesSections } from "@/data/mock-data"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export function SectionStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statistiquesSections.map((section) => (
        <Card key={section.section}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Section {section.section}: {section.titre}
            </CardTitle>
            <CardDescription>{section.nombreEvaluations} évaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{section.scoreMoyen.toFixed(1)}/5</div>
            <div className="flex items-center mt-1">
              {section.progression > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : section.progression < 0 ? (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <span className="h-4 w-4 mr-1" />
              )}
              <p
                className={`text-xs ${
                  section.progression > 0
                    ? "text-green-500"
                    : section.progression < 0
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {section.progression > 0 ? "+" : ""}
                {section.progression}% depuis la dernière période
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

