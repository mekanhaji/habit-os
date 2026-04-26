import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { useTheme } from "../components/theme-provider.tsx"
import { habitStore, useHabitStore } from "../store/habit-store"

export function SettingsPage() {
  const points = useHabitStore((state) => state.points)
  const level = useHabitStore((state) => state.level)
  const { theme, setTheme } = useTheme()
  const darkModeEnabled = theme === "dark"

  function handleResetAllData() {
    localStorage.clear()
    habitStore.reset()
  }

  return (
    <section className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage app data and simple display preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Dark mode</p>
              <p className="text-sm text-muted-foreground">UI only toggle.</p>
            </div>
            <Switch
              checked={darkModeEnabled}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <p className="text-sm text-muted-foreground">Current level</p>
            <p className="text-base font-medium">{level}</p>
            <p className="text-sm text-muted-foreground">Total points</p>
            <p className="text-base font-medium">{points}</p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResetAllData}
          >
            Reset all data
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
