export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your task management dashboard. Use the sidebar to navigate to different sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Access your tasks, manage tags, and more.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              View your latest task updates and progress.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
            <p className="text-sm text-muted-foreground">
              See your productivity metrics and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}