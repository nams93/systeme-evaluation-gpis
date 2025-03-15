import type React from "react"
import { MainNav } from "@/components/main-nav"

export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Espace pour des éléments supplémentaires comme un profil utilisateur */}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

