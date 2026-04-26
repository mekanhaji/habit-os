import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

export function LandingPage() {
  return (
    <section className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Gamified Habit Tracker</CardTitle>
          <CardDescription>
            Track habits, build streaks, unlock rewards, and explore the AI
            assistant placeholder.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Habit tracking, streaks, rewards, and a place for AI-powered help.
          </p>
        </CardContent>

        <div className="px-6 pb-6">
          <Button asChild className="w-full">
            <Link to="/app">Get Started</Link>
          </Button>
        </div>
      </Card>
    </section>
  )
}
