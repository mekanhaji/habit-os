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
import { userProfileStore, useUserProfileStore } from "../store/user-profile-store"

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
  const profile = useUserProfileStore((state) => state.profile)
  
  const [name, setName] = useState(profile?.name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [email, setEmail] = useState(profile?.email || "")
  const [avatar, setAvatar] = useState<string>(profile?.avatar || "")
  const [showErrors, setShowErrors] = useState(false)

  const PreviewIcon = AVATAR_OPTIONS.find((opt) => opt.id === avatar)?.icon || User

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
    <section className="mx-auto max-w-5xl pb-10 pt-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {profile ? "Edit your profile" : "Create your profile"}
            </h1>
            <p className="text-muted-foreground mt-2">
              This is a simple local profile gate, not real authentication.
            </p>
          </div>
          <Button type="submit" className="w-full sm:w-auto px-8">
            {profile ? "Save changes" : "Continue to app"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Enter your information and select an avatar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>

        {/* RIGHT COLUMN: Preview & Avatar Selection */}
        <div className="md:sticky md:top-24 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your profile will appear.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-border/50 bg-muted/20 py-12 shadow-sm">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm ring-4 ring-primary/5">
                  <PreviewIcon className="size-12" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl font-bold tracking-tight text-foreground">
                    @{username.trim() || "username"}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Avatar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose Avatar</CardTitle>
              <CardDescription>Select an icon that represents you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const isSelected = avatar === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAvatar(option.id)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-6" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  )
                })}
              </div>
              {showErrors && !avatar.trim() ? (
                <p className="text-xs text-destructive mt-3">
                  Please select an avatar.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
        </div>
      </form>
    </section>
  )
}
