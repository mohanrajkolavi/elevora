// Validation utilities using Zod
import { z } from "zod"

// Example validation schemas
export const exampleSchema = z.object({
  // Add your validation schemas here
})

export type ExampleSchema = z.infer<typeof exampleSchema>
