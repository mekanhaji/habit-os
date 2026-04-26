import { useSyncExternalStore } from "react"

export type Category = "health" | "productivity"
export type HabitFilter = "all" | Category

export interface Habit {
  id: number
  name: string
  category: Category
  streak: number
  lastCompleted: string | null
  lastProgressDate: string | null
  targetCount: number
  completedCount: number
  unit: string
}

interface HabitState {
  habits: Habit[]
  filter: HabitFilter
  points: number
  level: number
}

type HabitStateUpdater = (prevState: HabitState) => HabitState

const initialState: HabitState = {
  habits: [],
  filter: "all",
  points: 0,
  level: 1,
}

let state: HabitState = initialState
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function setState(updater: HabitStateUpdater) {
  state = updater(state)
  emitChange()
}

export const habitStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setHabits(habits: Habit[]) {
    setState((prevState) => ({ ...prevState, habits }))
  },
  update(updater: HabitStateUpdater) {
    setState(updater)
  },
  setFilter(filter: HabitFilter) {
    setState((prevState) => ({ ...prevState, filter }))
  },
  setPoints(points: number) {
    setState((prevState) => ({ ...prevState, points }))
  },
  setLevel(level: number) {
    setState((prevState) => ({ ...prevState, level }))
  },
  reset() {
    state = initialState
    emitChange()
  },
}

export function useHabitStore<T>(selector: (storeState: HabitState) => T): T {
  return useSyncExternalStore(
    habitStore.subscribe,
    () => selector(habitStore.getState()),
    () => selector(habitStore.getState())
  )
}
