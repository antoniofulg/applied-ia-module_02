import { StateGraph, START, END } from "@langchain/langgraph"
import { identifyIntent } from "./nodes/identifyIntentNode.ts"
import { chatResponse } from "./nodes/chatResponseNode.ts"
import { upperCase } from "./nodes/upperCaseNode.ts"
import { lowerCase } from "./nodes/lowerCaseNode.ts"
import { fallback } from "./nodes/fallbackNode.ts"
import { GraphStateSchema, type GraphState } from "./state.ts"

export type { GraphState, GraphStateUpdate, GraphCommand } from "./state.ts"

export const buildGraph = () =>
	new StateGraph(GraphStateSchema)
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
