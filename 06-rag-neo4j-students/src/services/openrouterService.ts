import { ChatOpenAI } from "@langchain/openai"
import { config } from "../config.ts"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { z } from "zod/v3"

export type LLMResponse = {
	model: string
	content: string
}

export class OpenRouterService {
	private llmClient: ChatOpenAI

	constructor() {
		this.llmClient = new ChatOpenAI({
			apiKey: config.apiKey,
			modelName: config.models[0],
			temperature: config.temperature,
			configuration: {
				baseURL: "https://openrouter.ai/api/v1",
				defaultHeaders: {
					"HTTP-Referer": config.httpReferer,
					"X-Title": config.xTitle,
				},
			},

			// Pass provider routing and models array to OpenRouter
			modelKwargs: {
				models: config.models,
				provider: config.provider,
			},
		})
	}

	async generateStructured<T>(
		systemPrompt: string,
		userPrompt: string,
		schema: z.ZodSchema<T>,
	) {
		try {
			const structuredLlm = this.llmClient.withStructuredOutput(schema)
			const messages = [
				new SystemMessage(systemPrompt),
				new HumanMessage(userPrompt),
			]

			const data = await structuredLlm.invoke(messages)
			return {
				success: true,
				data: data as T,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			}
		}
	}
}
