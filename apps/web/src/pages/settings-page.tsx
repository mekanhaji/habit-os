import { Button } from "@workspace/ui/components/button"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { Flame, Heart, Leaf, Rocket, Star, User, Download, Upload } from "lucide-react"
import { useTheme } from "../components/theme-provider.tsx"
import { habitStore, useHabitStore } from "../store/habit-store"
import {
  useUserProfileStore,
  userProfileStore,
} from "../store/user-profile-store"

function AvatarIcon({ avatarId, className }: { avatarId: string; className?: string }) {
  if (avatarId === "trailblazer") return <Rocket className={className} aria-hidden="true" />
  if (avatarId === "steady-flame") return <Flame className={className} aria-hidden="true" />
  if (avatarId === "kind-heart") return <Heart className={className} aria-hidden="true" />
  if (avatarId === "focus-star") return <Star className={className} aria-hidden="true" />
  if (avatarId === "growth-leaf") return <Leaf className={className} aria-hidden="true" />
  return <User className={className} aria-hidden="true" />
}

export function SettingsPage() {
  const navigate = useNavigate()
  const points = useHabitStore((state) => state.points)
  const level = useHabitStore((state) => state.level)
  const profile = useUserProfileStore((state) => state.profile)
  const { theme, setTheme } = useTheme()
  const darkModeEnabled = theme === "dark"

  function handleResetAllData() {
    localStorage.clear()
    habitStore.reset()
  }

  function handleResetProfile() {
    localStorage.removeItem("userProfile")
    userProfileStore.clearProfile()
    navigate("/profile", { replace: true })
  }

  function handleExportData() {
    const data = {
      habits: habitStore.getState().habits,
      points: habitStore.getState().points,
      level: habitStore.getState().level,
      userProfile: userProfileStore.getState().profile
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "habit-data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleImportData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string
        const parsed = JSON.parse(result)
        
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.habits)) {
          alert("Invalid file format. Missing habits array.")
          return
        }

        if (window.confirm("This will overwrite your existing data. Are you sure?")) {
          habitStore.setHabits(parsed.habits)
          if (typeof parsed.points === 'number') habitStore.setPoints(parsed.points)
          if (typeof parsed.level === 'number') habitStore.setLevel(parsed.level)
          
          if (parsed.userProfile) {
            userProfileStore.setProfile(parsed.userProfile)
          } else {
            userProfileStore.clearProfile()
          }

          localStorage.setItem("habitData", JSON.stringify({
            habits: parsed.habits,
            points: parsed.points ?? 0,
            level: parsed.level ?? 1
          }))
          
          alert("Data imported successfully!")
        }
      } catch (err) {
        alert("Failed to parse JSON file.")
      }
      
      if (event.target) {
        event.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your preferences, profile, and app data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your application experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium text-base text-foreground">Dark mode</h3>
                  <p className="text-sm text-muted-foreground">UI only toggle.</p>
                </div>
                <Switch
                  checked={darkModeEnabled}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Your current progress and level.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-5 space-y-2 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-4xl font-bold text-foreground">{level}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 space-y-2 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-4xl font-bold text-foreground">{points}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export your data or import from a backup.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="font-medium text-base text-foreground">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Download a backup of all your habits and profile.</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportData}
                >
                  <Upload className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
              <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="font-medium text-base text-foreground">Import Data</h3>
                  <p className="text-sm text-muted-foreground">Restore your data from a JSON file.</p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImportData}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-4 w-4" /> Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal identity and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AvatarIcon avatarId={profile.avatar} className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">@{profile.username}</p>
                    {profile.name && <p className="text-sm text-muted-foreground">{profile.name}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not set</p>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/profile")}
              >
                {profile ? "Edit Profile" : "Create Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="font-medium text-base text-foreground">Reset Profile</h3>
                  <p className="text-sm text-muted-foreground">Remove your profile data only.</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetProfile}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Reset Profile
                </Button>
              </div>
              <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="font-medium text-base text-foreground">Reset All Data</h3>
                  <p className="text-sm text-muted-foreground">Delete habits, progress, and profile.</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetAllData}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Reset all data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
