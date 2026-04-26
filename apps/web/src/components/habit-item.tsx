import type { Habit } from "../store/habit-store"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type HabitItemProps = {
  habit: Habit
  onComplete: (habitId: number) => void
  onReset: (habitId: number) => void
  onDelete: (habitId: number) => void
}

function isCompletedToday(lastCompleted: Habit["lastCompleted"]): boolean {
  if (!lastCompleted) {
    return false
  }

  return lastCompleted === new Date().toISOString().slice(0, 10)
}

function getMilestoneLabel(streak: number): string | null {
  if (streak >= 30) {
    return "Disciplined"
  }

  if (streak >= 7) {
    return "Consistent"
  }

  if (streak >= 3) {
    return "Getting Started"
  }

  return null
}

export function HabitItem({
  habit,
  onComplete,
  onReset,
  onDelete,
}: HabitItemProps) {
  const milestoneLabel = getMilestoneLabel(habit.streak)
  const completedToday = isCompletedToday(habit.lastCompleted)

  return (
    <li>
      <Card className="w-full">
        <CardHeader className="mb-2">
          <CardTitle>{habit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Category: {habit.category}</p>
          <p>🔥 {habit.streak} days</p>
          {completedToday ? (
            <p className="text-xs text-muted-foreground">Done today</p>
          ) : null}
          {milestoneLabel ? <p>Milestone: {milestoneLabel}</p> : null}
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            type="button"
            size="xs"
            disabled={completedToday}
            onClick={() => onComplete(habit.id)}
          >
            Complete
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => onReset(habit.id)}
          >
            Reset
          </Button>
          <Button
            type="button"
            size="xs"
            variant="destructive"
            onClick={() => onDelete(habit.id)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </li>
  )
}
