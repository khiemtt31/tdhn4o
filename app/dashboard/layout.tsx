import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}