"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { statistiquesAgents } from "@/data/mock-data"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

export function AgentsPerformance() {
  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Performance des agents par section</CardTitle>
        <CardDescription>Scores moyens des agents pour chaque section d'évaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Section 1</TableHead>
              <TableHead>Section 2</TableHead>
              <TableHead>Section 3</TableHead>
              <TableHead>Section 4</TableHead>
              <TableHead>Score global</TableHead>
              <TableHead>Tendance</TableHead>
              <TableHead>Dernière éval.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistiquesAgents.map((agent) => (
              <TableRow key={agent.agentId}>
                <TableCell className="font-medium">
                  {agent.prenom} {agent.nom}
                </TableCell>
                {agent.scoresParSection.map((section) => (
                  <TableCell key={section.section}>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-8 h-2 mr-2 rounded-full ${
                          section.score >= 4.5
                            ? "bg-green-500"
                            : section.score >= 3.5
                              ? "bg-green-300"
                              : section.score >= 2.5
                                ? "bg-yellow-400"
                                : "bg-red-500"
                        }`}
                      />
                      {section.score.toFixed(1)}
                    </div>
                  </TableCell>
                ))}
                <TableCell className="font-medium">{agent.scoreGlobal.toFixed(1)}</TableCell>
                <TableCell>
                  {agent.tendance === "hausse" ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      <span>Hausse</span>
                    </div>
                  ) : agent.tendance === "baisse" ? (
                    <div className="flex items-center text-red-500">
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                      <span>Baisse</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      <span>Stable</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{agent.derniereEvaluation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

