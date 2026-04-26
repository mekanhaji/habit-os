import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select } from "@workspace/ui/components/select"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { AiAssistant } from "../components/ai-assistant.tsx"
import { HabitItem } from "../components/habit-item"
import {
  habitStore,
  type Category,
  type Habit,
  type HabitFilter,
  useHabitStore,
} from "../store/habit-store"

const HABIT_DATA_KEY = "habitData"

const DEFAULT_TARGET_COUNT = 1
const DEFAULT_COMPLETED_COUNT = 0
const DEFAULT_UNIT = "times"

function isValidCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function isValidTargetCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 1
}

function normalizeHabit(value: unknown): Habit | null {
  if (typeof value !== "object" || value === null) {
    return null
  }

  const item = value as Record<string, unknown>

  if (
    typeof item.id !== "number" ||
    !Number.isFinite(item.id) ||
    typeof item.name !== "string" ||
    (item.category !== "health" && item.category !== "productivity") ||
    typeof item.streak !== "number" ||
    !Number.isFinite(item.streak) ||
    (typeof item.lastCompleted !== "string" && item.lastCompleted !== null)
  ) {
    return null
  }

  const today = new Date().toISOString().slice(0, 10)
  const targetCount = isValidTargetCount(item.targetCount)
    ? item.targetCount
    : DEFAULT_TARGET_COUNT
  const rawCompletedCount = isValidCount(item.completedCount)
    ? item.completedCount
    : DEFAULT_COMPLETED_COUNT
  const rawLastProgressDate =
    typeof item.lastProgressDate === "string" ? item.lastProgressDate : null
  const lastProgressDate =
    rawLastProgressDate === today ? rawLastProgressDate : null
  const completedCount = lastProgressDate === today ? rawCompletedCount : 0
  const unit = typeof item.unit === "string" ? item.unit : DEFAULT_UNIT

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    streak: item.streak,
    lastCompleted: item.lastCompleted,
    lastProgressDate,
    targetCount,
    completedCount,
    unit,
  }
}

function isHabitFilter(value: string): value is HabitFilter {
  return value === "all" || value === "health" || value === "productivity"
}

export function DashboardPage() {
  const habits = useHabitStore((state) => state.habits)
  const filter = useHabitStore((state) => state.filter)
  const points = useHabitStore((state) => state.points)
  const level = useHabitStore((state) => state.level)
  const hasHydratedRef = useRef(false)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
  const [habitName, setHabitName] = useState("")
  const [category, setCategory] = useState<Category>("health")
  const [targetCountInput, setTargetCountInput] = useState(
    String(DEFAULT_TARGET_COUNT)
  )
  const [unitInput, setUnitInput] = useState(DEFAULT_UNIT)
  const progressToNextLevel = points % 100
  const progressWidth = `${progressToNextLevel}%`
  const filteredHabits = habits.filter(
    (habit) => filter === "all" || habit.category === filter
  )

  function handleAddHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = habitName.trim()
    const parsedTargetCount = Number(targetCountInput)
    const trimmedUnit = unitInput.trim()

    if (
      !trimmedName ||
      !Number.isFinite(parsedTargetCount) ||
      parsedTargetCount < 1 ||
      !trimmedUnit
    ) {
      return false
    }

    const newHabit: Habit = {
      id: Date.now(),
      name: trimmedName,
      category,
      streak: 0,
      lastCompleted: null,
      lastProgressDate: null,
      targetCount: parsedTargetCount,
      completedCount: DEFAULT_COMPLETED_COUNT,
      unit: trimmedUnit,
    }

    habitStore.setHabits([...habits, newHabit])
    setHabitName("")
    setTargetCountInput(String(DEFAULT_TARGET_COUNT))
    setUnitInput(DEFAULT_UNIT)
    return true
  }

  function handleAddHabitSubmit(event: React.FormEvent<HTMLFormElement>) {
    const didAddHabit = handleAddHabit(event)

    if (didAddHabit) {
      setIsAddHabitOpen(false)
    }
  }

  function handleCompleteHabit(habitId: number) {
    const today = new Date().toISOString().slice(0, 10)

    habitStore.update((prevState) => {
      const targetHabit = prevState.habits.find((habit) => habit.id === habitId)

      if (!targetHabit) {
        return prevState
      }

      // If today's target is already completed, do not allow additional completions.
      if (targetHabit.lastCompleted === today) {
        return prevState
      }

      const completedCountForToday =
        targetHabit.lastProgressDate === today
          ? targetHabit.completedCount
          : DEFAULT_COMPLETED_COUNT
      const nextCompletedCount = completedCountForToday + 1
      const reachedTarget = nextCompletedCount >= targetHabit.targetCount

      const updatedPoints = reachedTarget
        ? prevState.points + 10
        : prevState.points
      const updatedLevel =
        reachedTarget && updatedPoints >= prevState.level * 100
          ? prevState.level + 1
          : prevState.level

      const updatedHabits = prevState.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        if (reachedTarget) {
          return {
            ...habit,
            streak: habit.streak + 1,
            lastCompleted: today,
            lastProgressDate: today,
            completedCount: 0,
          }
        }

        return {
          ...habit,
          lastProgressDate: today,
          completedCount: nextCompletedCount,
        }
      })

      return {
        ...prevState,
        habits: updatedHabits,
        points: updatedPoints,
        level: updatedLevel,
      }
    })
  }

  function handleResetHabit(habitId: number) {
    habitStore.update((prevState) => {
      const updatedHabits = prevState.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        return {
          ...habit,
          streak: 0,
          completedCount: 0,
          lastCompleted: null,
          lastProgressDate: null,
        }
      })

      return {
        ...prevState,
        habits: updatedHabits,
      }
    })
  }

  function handleDeleteHabit(habitId: number) {
    habitStore.update((prevState) => ({
      ...prevState,
      habits: prevState.habits.filter((habit) => habit.id !== habitId),
    }))
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextFilter = event.target.value

    if (!isHabitFilter(nextFilter)) {
      return
    }

    habitStore.setFilter(nextFilter)
  }

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const stored = localStorage.getItem(HABIT_DATA_KEY)

      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored) as unknown

      if (typeof parsed !== "object" || parsed === null) {
        return
      }

      const data = parsed as Record<string, unknown>

      if (Array.isArray(data.habits)) {
        const safeHabits = data.habits
          .map((habit) => normalizeHabit(habit))
          .filter((habit): habit is Habit => habit !== null)
        const habitsWithDailyReset = safeHabits.map((habit) => {
          if (habit.lastCompleted === today) {
            return habit
          }

          return {
            ...habit,
            completedCount: 0,
            lastProgressDate: null,
          }
        })

        habitStore.setHabits(habitsWithDailyReset)
      }

      if (typeof data.points === "number" && Number.isFinite(data.points)) {
        habitStore.setPoints(data.points)
      }

      if (typeof data.level === "number" && Number.isFinite(data.level)) {
        habitStore.setLevel(data.level)
      }
    } catch {
      // Ignore malformed localStorage payloads and keep defaults.
    } finally {
      hasHydratedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return
    }

    try {
      localStorage.setItem(
        HABIT_DATA_KEY,
        JSON.stringify({
          habits,
          points,
          level,
        })
      )
    } catch {
      // Ignore storage write failures (e.g. quota exceeded).
    }
  }, [habits, points, level])

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Habits</h1>
        <p className="text-muted-foreground">Track your daily progress and achieve your goals.</p>
      </header>

      {/* Stats Section */}
      <Card>
        <CardContent className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
          <div className="flex w-full justify-around gap-8 sm:w-auto sm:justify-start">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-medium text-muted-foreground">Total Points</p>
              <p className="text-3xl font-bold text-foreground">{points}</p>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-medium text-muted-foreground">Current Level</p>
              <p className="text-3xl font-bold text-foreground">{level}</p>
            </div>
          </div>
          <div className="w-full space-y-2 sm:max-w-md">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">Progress to Next Level</span>
              <span className="font-medium">{progressToNextLevel} / 100</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground transition-all duration-500 ease-out"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          size="lg"
          onClick={() => setIsAddHabitOpen(true)}
        >
          Add New Habit
        </Button>

        <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>Create a new habit to track your progress.</DialogDescription>
            </DialogHeader>

            <form
              className="flex flex-col gap-4 py-4"
              onSubmit={handleAddHabitSubmit}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  value={habitName}
                  onChange={(event) => setHabitName(event.target.value)}
                  placeholder="e.g., Read 10 pages, Drink water"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as Category)
                  }
                >
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Count</label>
                  <Input
                    type="number"
                    min={1}
                    value={targetCountInput}
                    onChange={(event) => setTargetCountInput(event.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Input
                    value={unitInput}
                    onChange={(event) => setUnitInput(event.target.value)}
                    placeholder="times, minutes, pages"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Habit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">Filter by:</span>
          <Select value={filter} onChange={handleFilterChange} className="w-full sm:w-40">
            <option value="all">All Categories</option>
            <option value="health">Health</option>
            <option value="productivity">Productivity</option>
          </Select>
        </div>
      </section>

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <CardContent className="space-y-4">
            <h3 className="text-xl font-semibold">No habits found</h3>
            <p className="max-w-sm text-muted-foreground">
              {filter === "all"
                ? "You haven't added any habits yet. Start tracking your progress today!"
                : `No habits found in the ${filter} category.`}
            </p>
            {filter === "all" && (
              <Button onClick={() => setIsAddHabitOpen(true)} className="mt-4">
                Create Your First Habit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
              onReset={handleResetHabit}
              onDelete={handleDeleteHabit}
            />
          ))}
        </ul>
      )}

      {/* AI Assistant Section */}
      <Card className="mt-12 border-dashed bg-muted/50">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              ✨ AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground">Ask questions or get recommendations about your habits.</p>
          </div>
          <AiAssistant />
        </CardContent>
      </Card>

      <div className="pt-4 text-center text-xs text-muted-foreground">
        (Press <kbd className="rounded border bg-muted px-1 py-0.5">d</kbd> to toggle dark mode)
      </div>
    </div>
  )
}
