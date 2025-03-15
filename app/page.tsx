import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aFnyILhXkJNsRM2UDKHhU0v2DKbGCw.png"
            alt="Logo"
            className="w-32 h-32 mx-auto invert"
          />
        </div>
        <h1 className="text-3xl font-light uppercase tracking-wider mb-12">Système d&#39;Évaluation des Agents</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mb-12">
        <Link
          href="/evaluation/nouvelle"
          className="bg-black bg-opacity-30 p-6 rounded-xl border border-white border-opacity-20 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-800 bg-opacity-20 rounded-full mb-4">
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
                className="text-blue-300"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2">Nouvelle Évaluation</h2>
            <p className="text-sm text-gray-300">Créer une nouvelle évaluation d&#39;agent</p>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="bg-black bg-opacity-30 p-6 rounded-xl border border-white border-opacity-20 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-800 bg-opacity-20 rounded-full mb-4">
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
                className="text-blue-300"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2">Tableau de Bord</h2>
            <p className="text-sm text-gray-300">Consulter les évaluations et statistiques</p>
          </div>
        </Link>
      </div>

      <div className="mt-auto pb-6">
        <div className="bg-black bg-opacity-30 px-6 py-2 rounded-full text-sm">
          DIROPS - Application créée par Manassé B
        </div>
      </div>
    </div>
  )
}

