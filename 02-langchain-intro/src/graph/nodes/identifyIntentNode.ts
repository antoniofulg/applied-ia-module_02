import type { GraphNode } from "@langchain/langgraph"
import { type GraphState, type GraphStateSchema } from "../state.ts"

export const identifyIntent: GraphNode<typeof GraphStateSchema> = (state) => {
	const input = state.messages.at(-1)?.text ?? ""
	const inputLower = input.toLowerCase()

	let command: GraphState["command"] = "unknown"

	if (inputLower.includes("upper")) command = "uppercase"
	else if (inputLower.includes("lower")) command = "lowercase"

	return {
		command,
		output: input,
	}
}
