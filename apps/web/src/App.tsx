import { Flame, Heart, Leaf, Rocket, Settings, Star, User } from "lucide-react"
import { type ReactNode } from "react"
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes
} from "react-router-dom"
import { DashboardPage } from "./pages/dashboard-page"
import { LandingPage } from "./pages/landing-page"
import { ProfilePage } from "./pages/profile-page.tsx"
import { SettingsPage } from "./pages/settings-page"
import { useUserProfileStore } from "./store/user-profile-store"


function AvatarIcon({ avatarId }: { avatarId: string }) {
  if (avatarId === "trailblazer") {
    return <Rocket className="size-3.5" aria-hidden="true" />
  }

  if (avatarId === "steady-flame") {
    return <Flame className="size-3.5" aria-hidden="true" />
  }

  if (avatarId === "kind-heart") {
    return <Heart className="size-3.5" aria-hidden="true" />
  }

  if (avatarId === "focus-star") {
    return <Star className="size-3.5" aria-hidden="true" />
  }

  if (avatarId === "growth-leaf") {
    return <Leaf className="size-3.5" aria-hidden="true" />
  }

  return <User className="size-3.5" aria-hidden="true" />
}


function ProtectedRoute({ children }: { children: ReactNode }) {
  const profile = useUserProfileStore((state) => state.profile)

  if (!profile) {
    return <Navigate to="/profile" replace />
  }

  return <>{children}</>
}

export function App() {
  const profile = useUserProfileStore((state) => state.profile)

  return (
    <BrowserRouter>
      <div className="min-h-svh p-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-sm leading-relaxed">
          <header className="flex items-center justify-between border-b pb-4 pt-2">
            <Link to="/" className="text-xl font-extrabold tracking-tight text-foreground">
              habit.os
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                {profile ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                  >
                    <AvatarIcon avatarId={profile.avatar} />
                    <span className="hidden sm:inline-block">@{profile.username}</span>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Create Profile
                  </Link>
                )}

                <Link
                  to="/settings"
                  className="flex items-center gap-2 rounded-full p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="size-5" />
                  <span className="hidden sm:inline-block">Settings</span>
                </Link>
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
