import { type GraphState, type GraphStateUpdate } from "../graph.ts"

export const upperCase = (state: GraphState): GraphStateUpdate => {
	const responseText = state.output.toUpperCase()

	return {
		output: responseText,
	}
}
