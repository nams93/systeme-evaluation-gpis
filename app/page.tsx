import Link from "next/link"

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GPISB-J5IttI18x5cFmKVHwXM1XedQTv05zC.jpeg")',
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Bienvenue à la DIROPS</h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12">Système d'Évaluation des Agents GPIS</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/evaluation/nouvelle"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-lg"
          >
            Nouvelle Évaluation
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md border border-gray-600 transition-colors duration-200 text-lg"
          >
            Tableau de Bord
          </Link>
        </div>
        <div className="absolute bottom-4 text-gray-300 text-sm font-light">Application créée par Manassé B</div>
      </div>
    </div>
  )
}

