import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select } from "@workspace/ui/components/select"
import { AiAssistant } from "./components/ai-assistant.tsx"
import { HabitItem } from "./components/habit-item"
import {
  habitStore,
  type Category,
  type Habit,
  type HabitFilter,
  useHabitStore,
} from "./store/habit-store"

const HABIT_DATA_KEY = "habitData"

function isHabit(value: unknown): value is Habit {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.id === "number" &&
    Number.isFinite(item.id) &&
    typeof item.name === "string" &&
    (item.category === "health" || item.category === "productivity") &&
    typeof item.streak === "number" &&
    Number.isFinite(item.streak) &&
    (typeof item.lastCompleted === "string" || item.lastCompleted === null)
  )
}

function isHabitFilter(value: string): value is HabitFilter {
  return value === "all" || value === "health" || value === "productivity"
}

export function App() {
  const habits = useHabitStore((state) => state.habits)
  const filter = useHabitStore((state) => state.filter)
  const points = useHabitStore((state) => state.points)
  const level = useHabitStore((state) => state.level)
  const hasHydratedRef = useRef(false)
  const [habitName, setHabitName] = useState("")
  const [category, setCategory] = useState<Category>("health")
  const progressToNextLevel = points % 100
  const progressWidth = `${progressToNextLevel}%`
  const filteredHabits = habits.filter(
    (habit) => filter === "all" || habit.category === filter
  )

  function handleAddHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = habitName.trim()

    if (!trimmedName) {
      return
    }

    const newHabit: Habit = {
      id: Date.now(),
      name: trimmedName,
      category,
      streak: 0,
      lastCompleted: null,
    }

    habitStore.setHabits([...habits, newHabit])
    setHabitName("")
  }

  function handleCompleteHabit(habitId: number) {
    const today = new Date().toISOString().slice(0, 10)

    habitStore.update((prevState) => {
      const targetHabit = prevState.habits.find((habit) => habit.id === habitId)

      if (!targetHabit || targetHabit.lastCompleted === today) {
        return prevState
      }

      const updatedHabits = prevState.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        return {
          ...habit,
          streak: habit.streak + 1,
          lastCompleted: today,
        }
      })

      const updatedPoints = prevState.points + 10
      const updatedLevel =
        updatedPoints >= prevState.level * 100
          ? prevState.level + 1
          : prevState.level

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
        const safeHabits = data.habits.filter(isHabit)
        habitStore.setHabits(safeHabits)
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
    <div className="min-h-svh p-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-sm leading-relaxed">
        <header className="space-y-1">
          <h1 className="text-lg font-medium">Project ready!</h1>
          <p className="text-muted-foreground">Add your first habit.</p>
        </header>

        <section className="space-y-3">
          <form className="flex flex-col gap-2" onSubmit={handleAddHabit}>
            <Input
              value={habitName}
              onChange={(event) => setHabitName(event.target.value)}
              placeholder="Habit name"
            />
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
            >
              <option value="health">health</option>
              <option value="productivity">productivity</option>
            </Select>
            <Button type="submit" className="w-fit">
              Add
            </Button>
          </form>

          <div className="flex flex-col gap-3">
            <Select value={filter} onChange={handleFilterChange}>
              <option value="all">all</option>
              <option value="health">health</option>
              <option value="productivity">productivity</option>
            </Select>

            <div className="space-y-1">
              <p>Total points: {points}</p>
              <p>Current level: {level}</p>
              <p>Progress to next level: {progressToNextLevel}/100</p>
              <div className="h-2 w-full overflow-hidden bg-muted">
                <div
                  className="h-full bg-foreground"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>
          </div>
        </section>

        <ul className="space-y-3">
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

        <AiAssistant />

        <div className="text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
