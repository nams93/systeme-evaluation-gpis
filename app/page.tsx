import Link from "next/link"

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GPISB-WGVW7u3bG7sEMjl854FakOhiek4UEw.jpeg")',
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl font-bold text-white uppercase tracking-wider mb-6">Système d'Évaluation des Agents</h1>
        <p className="text-xl text-white/80">GPIS - Direction des Opérations</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mb-12">
        <Link
          href="/evaluation/nouvelle"
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center hover:bg-white/15 transition-all"
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2 text-white">Nouvelle Évaluation</h2>
            <p className="text-sm text-white/80">Créer une nouvelle évaluation d'agent</p>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center hover:bg-white/15 transition-all"
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2 text-white">Tableau de Bord</h2>
            <p className="text-sm text-white/80">Consulter les évaluations et statistiques</p>
          </div>
        </Link>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm text-white/60">
          DIROPS - Application créée par Manassé B
        </div>
      </div>
    </div>
  )
}

