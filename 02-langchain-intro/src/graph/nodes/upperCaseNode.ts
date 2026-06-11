import type { GraphNode } from "@langchain/langgraph"
import { type GraphStateSchema } from "../state.ts"

export const upperCase: GraphNode<typeof GraphStateSchema> = (state) => ({
	output: state.output.toUpperCase(),
})
