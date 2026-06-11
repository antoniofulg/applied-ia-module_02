import { type GraphState, type GraphStateUpdate } from "../graph.ts"

export const identifyIntent = (state: GraphState): GraphStateUpdate => {
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
