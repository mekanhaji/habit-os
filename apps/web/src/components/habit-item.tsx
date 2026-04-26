import type { Habit } from "../store/habit-store"
import { Button } from "@workspace/ui/components/button"

type HabitItemProps = {
  habit: Habit
  onComplete: (habitId: number) => void
}

export function HabitItem({ habit, onComplete }: HabitItemProps) {
  return (
    <li>
      <span>{habit.name}</span> <span>({habit.category})</span>{" "}
      <span>Streak: {habit.streak}</span>
      <Button
        type="button"
        size="xs"
        className="ml-2"
        onClick={() => onComplete(habit.id)}
      >
        Complete
      </Button>
    </li>
  )
}
