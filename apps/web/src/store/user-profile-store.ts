import { useSyncExternalStore } from "react"

export type UserProfile = {
  name: string
  username: string
  email: string
  avatar: string
}

const STORAGE_KEY = "userProfile"

function readStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as UserProfile
  } catch {
    return null
  }
}

function writeStoredProfile(profile: UserProfile | null) {
  if (typeof window === "undefined") {
    return
  }

  if (profile === null) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

type UserProfileState = {
  profile: UserProfile | null
}

type UserProfileUpdater = (prevState: UserProfileState) => UserProfileState

const listeners = new Set<() => void>()

let state: UserProfileState = {
  profile: readStoredProfile(),
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

function setState(updater: UserProfileUpdater) {
  state = updater(state)
  writeStoredProfile(state.profile)
  emitChange()
}

export const userProfileStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setProfile(profile: UserProfile) {
    setState(() => ({ profile }))
  },
  clearProfile() {
    setState(() => ({ profile: null }))
  },
}

export function useUserProfileStore<T>(
  selector: (storeState: UserProfileState) => T
): T {
  return useSyncExternalStore(
    userProfileStore.subscribe,
    () => selector(userProfileStore.getState()),
    () => selector(userProfileStore.getState())
  )
}
