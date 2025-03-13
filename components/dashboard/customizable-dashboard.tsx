"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GripVertical, Settings, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Composants disponibles pour le tableau de bord
const availableWidgets = [
  { id: "performance-chart", name: "Graphique de performance", enabled: true },
  { id: "recent-evaluations", name: "Évaluations récentes", enabled: true },
  { id: "stats-overview", name: "Statistiques générales", enabled: true },
  { id: "agent-ranking", name: "Classement des agents", enabled: true },
  { id: "activity-log", name: "Journal d'activité", enabled: true },
  { id: "calendar", name: "Calendrier d'évaluations", enabled: true },
  { id: "comparison", name: "Comparaison d'agents", enabled: false },
  { id: "reports", name: "Rapports programmés", enabled: false },
]

// Composant pour un widget triable
function SortableWidget({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab p-1 mr-2 rounded hover:bg-muted"
              aria-label="Déplacer"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <CardTitle className="text-base">{availableWidgets.find((w) => w.id === id)?.name}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export function CustomizableDashboard() {
  const [activeWidgets, setActiveWidgets] = useState([
    "performance-chart",
    "recent-evaluations",
    "stats-overview",
    "agent-ranking",
  ])

  const [availableWidgetsState, setAvailableWidgetsState] = useState(availableWidgets)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleWidget = (id) => {
    setAvailableWidgetsState(
      availableWidgetsState.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)),
    )

    if (availableWidgetsState.find((w) => w.id === id)?.enabled) {
      // Désactiver le widget
      setActiveWidgets(activeWidgets.filter((widgetId) => widgetId !== id))
    } else {
      // Activer le widget
      setActiveWidgets([...activeWidgets, id])
    }

    toast({
      title: "Tableau de bord mis à jour",
      description: "Vos préférences ont été enregistrées.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tableau de bord personnalisé</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Personnaliser
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personnaliser le tableau de bord</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Sélectionnez les widgets à afficher sur votre tableau de bord
              </p>

              <div className="space-y-2">
                {availableWidgetsState.map((widget) => (
                  <div key={widget.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`widget-${widget.id}`}
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                    <Label htmlFor={`widget-${widget.id}`}>{widget.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeWidgets}>
          {activeWidgets.map((id) => (
            <SortableWidget key={id} id={id}>
              {/* Contenu du widget en fonction de son ID */}
              {id === "performance-chart" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
                  Graphique de performance
                </div>
              )}
              {id === "recent-evaluations" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">Évaluations récentes</div>
              )}
              {id === "stats-overview" && (
                <div className="h-32 bg-muted/30 rounded flex items-center justify-center">Statistiques générales</div>
              )}
              {id === "agent-ranking" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">Classement des agents</div>
              )}
              {id === "activity-log" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">Journal d'activité</div>
              )}
              {id === "calendar" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
                  Calendrier d'évaluations
                </div>
              )}
              {id === "comparison" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">Comparaison d'agents</div>
              )}
              {id === "reports" && (
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">Rapports programmés</div>
              )}
            </SortableWidget>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

