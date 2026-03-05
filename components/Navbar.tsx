'use client'

import { useAuth, useUser, useClerk } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  ChevronDown,
  LayoutDashboard,
  Store,
  Receipt,
  Users,
  BarChart3,
  CreditCard,
  Bell,
  Sparkles,
  Power
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  requiresAuth?: boolean
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, requiresAuth: true },
  { label: 'POS', href: '/pos', icon: <Store className="w-4 h-4" />, requiresAuth: true },
  { label: 'Orders', href: '/orders', icon: <Receipt className="w-4 h-4" />, requiresAuth: true },
  { label: 'Employees', href: '/employees', icon: <Users className="w-4 h-4" />, requiresAuth: true, adminOnly: true },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" />, requiresAuth: true },
  { label: 'Expenses', href: '/expenses', icon: <CreditCard className="w-4 h-4" />, requiresAuth: true },
]

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showConfirmSignOut, setShowConfirmSignOut] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setShowConfirmSignOut(false)
    setUserMenuOpen(false)
  }

  // Filter nav items based on auth status and role
  const visibleNavItems = navItems.filter(item => {
    if (!item.requiresAuth) return true
    if (!isSignedIn) return false
    if (item.adminOnly && user?.publicMetadata?.role !== 'admin') return false
    return true
  })

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href={isSignedIn ? '/dashboard' : '/'} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-200 to-purple-200 bg-clip-text text-transparent hidden sm:block">
                  POS System
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {visibleNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <>
                      {/* Quick Sign Out Button - Desktop Only */}
                      <button
                        onClick={() => setShowConfirmSignOut(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all"
                        title="Sign Out"
                      >
                        <Power className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>

                      {/* Divider */}
                      <div className="hidden md:block w-px h-6 bg-[#333]" />

                      {/* Notifications */}
                      <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      </button>

                      {/* User Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all border border-transparent hover:border-[#333]"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0].toUpperCase()}
                          </div>
                          <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-white leading-tight">
                              {user?.firstName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 leading-tight">
                              {user?.publicMetadata?.role === 'admin' ? 'Admin' : 'Staff'}
                            </p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                          {userMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-56 bg-[#111] border border-[#222] rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                            >
                              <div className="p-3 border-b border-[#222]">
                                <p className="text-sm font-medium text-white">{user?.fullName || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                              </div>
                              
                              <div className="p-1">
                                <a
                                  href="/profile"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                                >
                                  <UserIcon className="w-4 h-4" />
                                  Profile
                                </a>
                                <a
                                  href="/settings"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                                >
                                  <Settings className="w-4 h-4" />
                                  Settings
                                </a>
                                <a
                                  href="/billing"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                                >
                                  <Sparkles className="w-4 h-4 text-amber-400" />
                                  Subscription
                                </a>
                              </div>

                              <div className="p-1 border-t border-[#222]">
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false)
                                    setShowConfirmSignOut(true)
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Sign Out
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    /* Auth Buttons for Non-Authenticated Users */
                    <div className="flex items-center gap-2">
                      <a
                        href="/sign-in"
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          pathname === '/sign-in'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        Sign In
                      </a>
                      <a
                        href="/sign-up"
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          pathname === '/sign-up'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/25'
                        }`}
                      >
                        Sign Up
                      </a>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#222] bg-[#0a0a0a]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {visibleNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}

                {!isSignedIn && (
                  <div className="pt-4 border-t border-[#222] space-y-2">
                    <a
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-all"
                    >
                      Sign In
                    </a>
                    <a
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg transition-all"
                    >
                      Sign Up
                    </a>
                  </div>
                )}

                {isSignedIn && (
                  <div className="pt-4 border-t border-[#222] space-y-2">
                    <a
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        setShowConfirmSignOut(true)
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Power className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSignOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmSignOut(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111] border border-[#222] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Power className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sign Out?</h3>
                <p className="text-sm text-gray-400">
                  Are you sure you want to sign out? Any unsaved changes will be lost.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSignOut(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-500/25"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}