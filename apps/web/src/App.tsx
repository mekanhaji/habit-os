import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom"
import { DashboardPage } from "./pages/dashboard-page"
import { LandingPage } from "./pages/landing-page"
import { SettingsPage } from "./pages/settings-page"

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-1 transition-colors",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ")

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh p-6">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-sm leading-relaxed">
          <nav className="flex items-center gap-2 border-b pb-3">
            <NavLink to="/" end className={navLinkClassName}>
              Home
            </NavLink>
            <NavLink to="/app" className={navLinkClassName}>
              App
            </NavLink>
            <NavLink to="/settings" className={navLinkClassName}>
              Settings
            </NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
