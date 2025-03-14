"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Données fictives pour les évaluations récentes
const recentEvaluations = [
  {
    id: "EVA-001",
    agent: "Martin Dupont",
    evaluateur: "Sophie Leclerc",
    date: "2023-11-15",
    score: 8.5,
    status: "Complétée",
  },
  {
    id: "EVA-002",
    agent: "Julie Martin",
    evaluateur: "Thomas Bernard",
    date: "2023-11-14",
    score: 7.8,
    status: "Complétée",
  },
  {
    id: "EVA-003",
    agent: "Alexandre Petit",
    evaluateur: "Sophie Leclerc",
    date: "2023-11-13",
    score: 9.2,
    status: "Complétée",
  },
  {
    id: "EVA-004",
    agent: "Camille Dubois",
    evaluateur: "Marc Leroy",
    date: "2023-11-12",
    score: 6.5,
    status: "Complétée",
  },
  {
    id: "EVA-005",
    agent: "Nicolas Moreau",
    evaluateur: "Thomas Bernard",
    date: "2023-11-10",
    score: 8.0,
    status: "Complétée",
  },
]

export function RecentEvaluations() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Évaluations récentes</CardTitle>
        <CardDescription>Les 5 dernières évaluations complétées</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Évaluateur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEvaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell className="font-medium">{evaluation.id}</TableCell>
                <TableCell>{evaluation.agent}</TableCell>
                <TableCell>{evaluation.evaluateur}</TableCell>
                <TableCell>{evaluation.date}</TableCell>
                <TableCell>{evaluation.score}</TableCell>
                <TableCell>{evaluation.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

