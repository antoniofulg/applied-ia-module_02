import { AIMessage } from "langchain"
import { type GraphStateUpdate } from "../graph.ts"

export const fallback = (): GraphStateUpdate => {
	const message =
		"Unknown command. Try 'make this uppercase' or 'convert to lowercase'"
	const aiMessage = new AIMessage(message)

	return {
		output: message,
		messages: [aiMessage],
	}
}
