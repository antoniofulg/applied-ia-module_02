import { AIMessage } from "@langchain/core/messages"
import type { GraphNode } from "@langchain/langgraph"
import { type GraphStateSchema } from "../state.ts"

export const chatResponse: GraphNode<typeof GraphStateSchema> = (state) => {
	const aiMessage = new AIMessage(state.output)

	return {
		messages: [aiMessage],
	}
}
