import { InitializeData } from "@/components/admin/initialize-data"
import { MigrationTool } from "@/components/dashboard/migration-tool"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administration du système</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InitializeData />
        <MigrationTool />
      </div>
    </div>
  )
}

