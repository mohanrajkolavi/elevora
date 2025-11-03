import { UserButton } from "@clerk/nextjs"
import { syncUserToDatabase } from "@/lib/auth"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sync user to database on app load
  await syncUserToDatabase()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Elevora</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
