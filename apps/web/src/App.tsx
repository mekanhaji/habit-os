import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom"
import { DashboardPage } from "./pages/dashboard-page"
import { LandingPage } from "./pages/landing-page"
import { SettingsPage } from "./pages/settings-page"

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh p-6">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-sm leading-relaxed">
          <nav className="flex gap-4 border-b pb-3">
            <NavLink to="/" end className="hover:underline">
              Home
            </NavLink>
            <NavLink to="/app" className="hover:underline">
              App
            </NavLink>
            <NavLink to="/settings" className="hover:underline">
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
