import { useState } from "react"
import {
  Flame,
  Heart,
  Leaf,
  Rocket,
  Star,
  User,
  type LucideIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { userProfileStore } from "../store/user-profile-store"

type AvatarOption = {
  id: string
  label: string
  icon: LucideIcon
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "trailblazer", label: "Trailblazer", icon: Rocket },
  { id: "steady-flame", label: "Steady Flame", icon: Flame },
  { id: "kind-heart", label: "Kind Heart", icon: Heart },
  { id: "focus-star", label: "Focus Star", icon: Star },
  { id: "growth-leaf", label: "Growth Leaf", icon: Leaf },
  { id: "classic", label: "Classic", icon: User },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<string>("")
  const [showErrors, setShowErrors] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const trimmedAvatar = avatar.trim()

    if (!trimmedName || !trimmedUsername || !trimmedEmail || !trimmedAvatar) {
      setShowErrors(true)
      return
    }

    setShowErrors(false)

    userProfileStore.setProfile({
      name: trimmedName,
      username: trimmedUsername,
      email: trimmedEmail,
      avatar: trimmedAvatar,
    })

    navigate("/app", { replace: true })
  }

  return (
    <section className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
          <CardDescription>
            This is a simple local profile gate, not real authentication.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                aria-invalid={showErrors && !name.trim()}
              />
              {showErrors && !name.trim() ? (
                <p className="text-xs text-destructive">Name is required.</p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                aria-invalid={showErrors && !username.trim()}
              />
              {showErrors && !username.trim() ? (
                <p className="text-xs text-destructive">
                  Username is required.
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-invalid={showErrors && !email.trim()}
              />
              {showErrors && !email.trim() ? (
                <p className="text-xs text-destructive">Email is required.</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Choose avatar</p>
              <div className="grid grid-cols-2 gap-2">
                {AVATAR_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const isSelected = avatar === option.id

                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="justify-start gap-2 tracking-normal normal-case"
                      onClick={() => setAvatar(option.id)}
                    >
                      <Icon className="size-4" />
                      <span>{option.label}</span>
                    </Button>
                  )
                })}
              </div>
              {showErrors && !avatar.trim() ? (
                <p className="text-xs text-destructive">
                  Please select an avatar.
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full">
              Continue to app
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
