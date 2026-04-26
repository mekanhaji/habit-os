import type { Habit } from "../store/habit-store"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

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
  const displayCompletedCount = completedToday
    ? habit.targetCount
    : Math.min(habit.completedCount, habit.targetCount)
  const isTargetReached = displayCompletedCount >= habit.targetCount

  return (
    <li>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-bold">{habit.name}</CardTitle>
          <Badge variant={habit.category as any}>{habit.category}</Badge>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>
                {displayCompletedCount} / {habit.targetCount} {habit.unit}
              </span>
              <span className="font-medium text-foreground">
                🔥 {habit.streak} days
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {completedToday ? (
                <span className="text-xs text-primary font-medium">
                  ✨ Done today
                </span>
              ) : null}
              {milestoneLabel ? (
                <span className="text-xs">Milestone: {milestoneLabel}</span>
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={isTargetReached}
            onClick={() => onComplete(habit.id)}
          >
            {isTargetReached ? "Completed" : "Complete"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onReset(habit.id)}
          >
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
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
