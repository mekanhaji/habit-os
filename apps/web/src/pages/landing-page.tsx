import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { BookOpen, CheckCircle2, Droplets, Dumbbell, Target, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function LandingPage() {
  const navigate = useNavigate()

  function handleGetStarted() {
    const hasProfile = localStorage.getItem("userProfile") !== null
    if (hasProfile) {
      navigate("/app")
    } else {
      navigate("/profile")
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100svh-4rem)] bg-background">
      {/* 1. Layout: Wider container, more whitespace, reduce excessive stacking */}
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 space-y-24">
        
        {/* Hero Section & Introduction & Call to Action */}
        <div className="space-y-8 text-left max-w-3xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-tight sm:leading-tight md:leading-tight">
              Level Up Your Daily Habits
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Track your habits, build unbreakable streaks, earn rewards, and watch your progress soar.
            </p>
          </div>
          
          <div className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            <p>
              We've turned the boring routine of habit building into a simple, rewarding game system. 
              Stay motivated by treating your real life like an RPG where consistency pays off!
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleGetStarted} size="lg" className="text-base px-10 py-6 rounded-full">
              Get Started
            </Button>
          </div>
        </div>

        {/* Use Case Cards */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-foreground">Why build habits with us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-2 bg-card hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-5 pb-2">
                <Dumbbell className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">Consistent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  Hit the gym regularly and build that fitness streak.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-2 bg-card hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-5 pb-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">Daily Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  Make reading a daily habit, chapter by chapter.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-2 bg-card hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-5 pb-2">
                <Droplets className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">Stay Hydrated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  Drink more water and keep your daily streak alive.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-2 bg-card hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-5 pb-2">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  Focus on deep work and crush your daily goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8 pt-10 border-t border-border/50">
          <h2 className="text-2xl font-bold text-foreground">Everything you need to succeed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-base text-muted-foreground">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 
              <span>Habit tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 
              <span>Streak system</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 
              <span>Rewards & levels</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" /> 
              <span>AI assistant (Coming soon)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
