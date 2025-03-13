"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ChevronLeft, Download, FileText, Search, User, Users, BarChart2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { exportToPDF, exportToCSV } from "@/lib/export-utils";
import { QuickReportWidget } from "@/components/dashboard/quick-report-widget";

export default function Dashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "evaluations"));
        const evaluationsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const savoirsConnaissances = [
            Number(data.connaissances_juridiques) || 0,
            Number(data.connaissance_structure) || 0,
            Number(data.connaissance_patrimoine) || 0,
          ];

          const savoirsFaire = [
            Number(data.transmissions) || 0,
            Number(data.vigilance) || 0,
            Number(data.deplacement) || 0,
            Number(data.distances) || 0,
            Number(data.positionnement) || 0,
            Number(data.contact) || 0,
            Number(data.stress) || 0,
            Number(data.participation) || 0,
          ];

          const savoirsEtre = [
            Number(data.maitrise) || 0,
            Number(data.equipements) || 0,
            Number(data.tenue) || 0,
            Number(data.proprete) || 0,
            Number(data.vehicule) || 0,
            Number(data.comportement) || 0,
            Number(data.exemplarite) || 0,
            Number(data.motivation) || 0,
            Number(data.interaction) || 0,
            Number(data.hierarchie) || 0,
          ];

          const validSavoirsConnaissances = savoirsConnaissances.filter((score) => score > 0);
          const validSavoirsFaire = savoirsFaire.filter((score) => score > 0);
          const validSavoirsEtre = savoirsEtre.filter((score) => score > 0);

          const moyenneSavoirsConnaissances =
            validSavoirsConnaissances.length > 0
              ? (validSavoirsConnaissances.reduce((a, b) => a + b, 0) / validSavoirsConnaissances.length).toFixed(2)
              : "0";

          const moyenneSavoirsFaire =
            validSavoirsFaire.length > 0
              ? (validSavoirsFaire.reduce((a, b) => a + b, 0) / validSavoirsFaire.length).toFixed(2)
              : "0";

          const moyenneSavoirsEtre =
            validSavoirsEtre.length > 0
              ? (validSavoirsEtre.reduce((a, b) => a + b, 0) / validSavoirsEtre.length).toFixed(2)
              : "0";

          const allValidScores = [...validSavoirsConnaissances, ...validSavoirsFaire, ...validSavoirsEtre];
          const moyenneGenerale =
            allValidScores.length > 0
              ? (allValidScores.reduce((a, b) => a + b, 0) / allValidScores.length).toFixed(2)
              : "0";

          evaluationsData.push({
            id: doc.id,
            agent: data.nom_agent,
            date: data.date || new Date().toLocaleDateString(),
            section: data.section || "Non spécifiée",
            indicatif: data.indicatif || "Non spécifié",
            connaissances_juridiques: data.connaissances_juridiques || "0",
            savoirsConnaissances: moyenneSavoirsConnaissances,
            savoirsFaire: moyenneSavoirsFaire,
            savoirsEtre: moyenneSavoirsEtre,
            moyenneGenerale,
          });
        });

        setEvaluations(evaluationsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des évaluations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluations();
  }, []);
}


