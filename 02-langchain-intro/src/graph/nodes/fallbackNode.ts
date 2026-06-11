import type { GraphNode } from "@langchain/langgraph"
import { type GraphStateSchema } from "../state.ts"

export const fallback: GraphNode<typeof GraphStateSchema> = () => ({
	output:
		"Unknown command. Try 'make this uppercase' or 'convert to lowercase'",
})
