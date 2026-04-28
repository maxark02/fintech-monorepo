import { Sidebar } from "./_components/Sidebar"
import { BottomNav } from "./_components/BottomNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f13]">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8 pb-24 md:pb-8 max-w-lg mx-auto w-full md:max-w-none">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
