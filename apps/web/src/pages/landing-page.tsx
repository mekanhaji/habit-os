import { Link, useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { CheckCircle2, Zap, Target, BookOpen, Droplets, Dumbbell } from "lucide-react"

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
    <div className="flex flex-col min-h-[calc(100svh-4rem)] items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl w-full space-y-16 text-center">
        
        {/* 1. Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Level Up Your Daily Habits
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Track your habits, build unbreakable streaks, earn rewards, and watch your progress soar.
          </p>
        </div>

        {/* 2. Fun Introduction */}
        <div className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/80">
          <p>
            We've turned the boring routine of habit building into a simple, rewarding game system. 
            Stay motivated by treating your real life like an RPG where consistency pays off!
          </p>
        </div>

        {/* 3. Use Cases Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">
          <div className="flex items-start space-x-4 p-5 rounded-xl bg-card border shadow-sm">
            <Dumbbell className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Consistent Workouts</h3>
              <p className="text-sm text-muted-foreground mt-1">Hit the gym regularly and build that fitness streak.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 rounded-xl bg-card border shadow-sm">
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Daily Reading</h3>
              <p className="text-sm text-muted-foreground mt-1">Make reading a daily habit, chapter by chapter.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 rounded-xl bg-card border shadow-sm">
            <Droplets className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Stay Hydrated</h3>
              <p className="text-sm text-muted-foreground mt-1">Drink more water and keep your daily streak alive.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 rounded-xl bg-card border shadow-sm">
            <Target className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Productivity</h3>
              <p className="text-sm text-muted-foreground mt-1">Focus on deep work and crush your daily goals.</p>
            </div>
          </div>
        </div>

        {/* 4. Features Section */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Everything you need to succeed</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center bg-secondary px-3 py-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Habit tracking</span>
            <span className="flex items-center bg-secondary px-3 py-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Streak system</span>
            <span className="flex items-center bg-secondary px-3 py-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Rewards & levels</span>
            <span className="flex items-center bg-secondary px-3 py-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Progress tracking</span>
            <span className="flex items-center bg-secondary px-3 py-1.5 rounded-full"><Zap className="h-4 w-4 mr-2 text-primary" /> AI assistant (Coming soon)</span>
          </div>
        </div>

        {/* 5. Call to Action */}
        <div className="space-y-4 pt-10 border-t">
          <p className="text-lg font-medium text-foreground">Ready to start your journey?</p>
          <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto text-base px-10 py-6 rounded-full">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
