import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

const mockSuggestions = [
  "Start with a 5-minute version of the habit to make it easy to begin.",
  "Attach the habit to an existing routine so it feels automatic.",
  "Keep the goal small and repeatable to build consistency first.",
  "Choose one trigger time each day and stick to it.",
]

export function AiAssistant() {
  const [question, setQuestion] = useState("")
  const [suggestion, setSuggestion] = useState(
    "Ask for habit advice and generate a placeholder suggestion."
  )

  function handleGenerate() {
    // This is a placeholder for future integration with an AI service via backend API
    const nextSuggestion =
      mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)]
    setSuggestion(nextSuggestion)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask for habit advice"
        />
        <Button type="button" className="w-fit" onClick={handleGenerate}>
          Generate
        </Button>
        <div className="min-h-16 rounded-none border border-dashed border-border p-3 text-sm text-muted-foreground">
          {suggestion}
        </div>
      </CardContent>
    </Card>
  )
}
