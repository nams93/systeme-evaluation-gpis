"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Welcome() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Image de fond avec overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GPIS_Dehors.jpg-MUVSamefVIjsIUTDSxnoAYfvbaWU0e.jpeg")',
          filter: "brightness(0.6)",
        }}
      />

      {/* Contenu */}
      <div className="relative z-10 text-center space-y-8 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Bienvenue à la DIROPS</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Système d'Évaluation des Agents GPIS
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link href="/evaluation">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Nouvelle Évaluation
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white px-8">
              Tableau de Bord
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center p-4 text-white/80 bg-black/30">
        <p className="text-sm">© 2024 DIROPS - GPIS. Tous droits réservés.</p>
      </div>
    </div>
  )
}

