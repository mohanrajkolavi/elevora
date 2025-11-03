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
          <div className="flex items-center gap-4">
            <a
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
