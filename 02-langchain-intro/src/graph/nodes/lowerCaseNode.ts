import { type GraphState, type GraphStateUpdate } from "../graph.ts"

export const lowerCase = (state: GraphState): GraphStateUpdate => {
	const responseText = state.output.toLowerCase()

	return {
		output: responseText,
	}
}
