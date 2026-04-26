import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select } from "@workspace/ui/components/select"
import { HabitItem } from "./components/habit-item"
import {
  habitStore,
  type Category,
  type Habit,
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

export function App() {
  const habits = useHabitStore((state) => state.habits)
  const filter = useHabitStore((state) => state.filter)
  const points = useHabitStore((state) => state.points)
  const level = useHabitStore((state) => state.level)
  const hasHydratedRef = useRef(false)
  const [habitName, setHabitName] = useState("")
  const [category, setCategory] = useState<Category>("health")

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

  // Keep state reads lint-clean until UI wiring is added.
  void [filter, points, level]

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>Add your first habit.</p>
          <form className="mt-3 flex flex-col gap-2" onSubmit={handleAddHabit}>
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

          <ul className="mt-4">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
              />
            ))}
          </ul>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
