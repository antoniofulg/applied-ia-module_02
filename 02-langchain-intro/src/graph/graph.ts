import {
	StateSchema,
	MessagesValue,
	StateGraph,
	START,
	END,
} from "@langchain/langgraph"
import { z } from "zod"
import { identifyIntent } from "./nodes/identifyIntentNode.ts"
import { chatResponse } from "./nodes/chatResponseNode.ts"
import { upperCase } from "./nodes/upperCaseNode.ts"
import { lowerCase } from "./nodes/lowerCaseNode.ts"
import { fallback } from "./nodes/fallbackNode.ts"

const State = new StateSchema({
	messages: MessagesValue,
	output: z.string(),
	command: z.enum(["uppercase", "lowercase", "unknown"]),
})

export type GraphState = typeof State.State
export type GraphStateUpdate = typeof State.Update
export type GraphCommand = GraphState["command"]

export const buildGraph = () =>
	new StateGraph(State)
		.addNode("identifyIntent", identifyIntent)
		.addNode("chatResponse", chatResponse)
		.addNode("upperCase", upperCase)
		.addNode("lowerCase", lowerCase)
		.addNode("fallback", fallback)
		.addEdge(START, "identifyIntent")
		.addConditionalEdges(
			"identifyIntent",
			(state: GraphState) => {
				switch (state.command) {
					case "uppercase":
						return "uppercase"
					case "lowercase":
						return "lowercase"
					default:
						return "fallback"
				}
			},
			{
				uppercase: "upperCase",
				lowercase: "lowerCase",
				fallback: "fallback",
			},
		)
		.addEdge("upperCase", "chatResponse")
		.addEdge("lowerCase", "chatResponse")
		.addEdge("fallback", "chatResponse")
		.addEdge("chatResponse", END)
		.compile()

// await graph.invoke({ messages: [{ role: "user", content: "hi!" }] })

/// ------ class code ------- ///

// const GraphState = z.object({
// 	messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
// 	output: z.string(),
// 	command: z.enum(["uppercase", "lowercase", "unknown"]),
// })

// export type GraphState = z.infer<typeof GraphState>

// export function buildGraph() {
// 	const workflow = new StateGraph({
// 		stateSchema: GraphState,
// 	})
// 		.addNode("identifyIntent", (state: GraphState) => {
// 			return {
// 				...state,
// 			}
// 		})
// 		.addEdge(START, "identifyIntent")
// 		.addEdge("identifyIntent", END)

// 	return workflow.compile()
// }
