import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage() {
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

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">DIROPS</h1>
          <p className="text-white/80 mt-2 text-xl">Système d'Évaluation des Agents GPIS</p>
        </div>

        <AuthForm />

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">Application créée par Manassé B</p>
        </div>
      </div>
    </div>
  )
}

