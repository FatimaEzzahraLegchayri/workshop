'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Palette, Calendar, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/service/authService'
import { ConfirmLogout } from './confirm-logout'

const navItems = [
  {
    title: 'Booking',
    href: '/booking',
    icon: Calendar,
  },
  {
    title: 'Workshops',
    href: '/workshops',
    icon: Palette,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <aside className="hidden md:flex w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-6 flex-col sticky top-0">
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              'text-destructive hover:bg-destructive/10 hover:text-destructive'
            )}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border px-4 py-2 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground opacity-70'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="flex flex-col items-center gap-1 p-2 text-destructive opacity-70"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>

      <ConfirmLogout
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  )
}