import { AIMessage } from "langchain"
import { type GraphState, type GraphStateUpdate } from "../graph.ts"

export const chatResponse = (state: GraphState): GraphStateUpdate => {
	const responseText = state.output
	const aiMessage = new AIMessage(responseText)

	return {
		messages: [aiMessage],
	}
}
