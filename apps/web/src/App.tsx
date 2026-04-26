import { type ReactNode } from "react"
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"
import { Flame, Heart, Leaf, Rocket, Star, User } from "lucide-react"
import { DashboardPage } from "./pages/dashboard-page"
import { LandingPage } from "./pages/landing-page"
import { ProfilePage } from "./pages/profile-page.tsx"
import { SettingsPage } from "./pages/settings-page"
import { useUserProfileStore } from "./store/user-profile-store"

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-1 transition-colors",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ")

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

function InitialRouteRedirect() {
  const profile = useUserProfileStore((state) => state.profile)

  if (!profile) {
    return <Navigate to="/profile" replace />
  }

  return <Navigate to="/app" replace />
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
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-sm leading-relaxed">
          <div className="space-y-3 border-b pb-3">
            <nav className="flex items-center gap-2">
              <NavLink to="/" end className={navLinkClassName}>
                Home
              </NavLink>
              <NavLink to="/app" className={navLinkClassName}>
                App
              </NavLink>
              <NavLink to="/profile" className={navLinkClassName}>
                Profile
              </NavLink>
              <NavLink to="/settings" className={navLinkClassName}>
                Settings
              </NavLink>
            </nav>

            {profile ? (
              <div className="inline-flex w-fit items-center gap-2 rounded-md border px-2 py-1 text-xs text-muted-foreground">
                <AvatarIcon avatarId={profile.avatar} />
                <span className="font-medium text-foreground">
                  @{profile.username}
                </span>
                {profile.name ? <span>({profile.name})</span> : null}
              </div>
            ) : null}
          </div>

          <Routes>
            <Route path="/" element={<InitialRouteRedirect />} />
            <Route path="/welcome" element={<LandingPage />} />
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
