import { openai } from "../config/openai"

export const refactorCode = async (code: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a senior software engineer who refactors code using SOLID and clean code principles. Return refactored code and explanation."
      },
      {
        role: "user",
        content: code
      }
    ]
  })

  return response.choices[0].message.content
}
