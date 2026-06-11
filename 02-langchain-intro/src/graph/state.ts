import { StateSchema, MessagesValue } from "@langchain/langgraph"
import { z } from "zod"

export const GraphStateSchema = new StateSchema({
	messages: MessagesValue,
	output: z.string(),
	command: z.enum(["uppercase", "lowercase", "unknown"]),
})

export type GraphState = typeof GraphStateSchema.State
export type GraphStateUpdate = typeof GraphStateSchema.Update
export type GraphCommand = GraphState["command"]
