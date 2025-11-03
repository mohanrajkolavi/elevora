export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">Dashboard content goes here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
