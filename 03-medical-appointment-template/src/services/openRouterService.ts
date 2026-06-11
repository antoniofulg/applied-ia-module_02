import { OpenRouter } from "@openrouter/sdk"
import { config, type ModelConfig } from "../config.ts"
import { z } from "zod/v3"

export type LLMResponse = {
	model: string
	content: string
}

function parseJsonContent(content: string): unknown {
	const trimmed = content.trim()
	const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
	const jsonText = fenced ? fenced[1] : trimmed
	return JSON.parse(jsonText)
}

export class OpenRouterService {
	private client: OpenRouter
	private config: ModelConfig

	constructor(configOverride?: ModelConfig) {
		this.config = { ...config, ...configOverride }

		this.client = new OpenRouter({
			apiKey: this.config.apiKey,
			httpReferer: this.config.httpReferer,
			xTitle: this.config.xTitle,
		})
	}

	async generateStructured<T>(
		systemPrompt: string,
		userPrompt: string,
		schema: z.ZodSchema<T>,
	) {
		try {
			const response = await this.client.chat.send({
				models: this.config.models,
				messages: [
					{
						role: "system",
						content: `${systemPrompt}\n\nRespond with valid JSON only. No markdown fences or extra text.`,
					},
					{ role: "user", content: userPrompt },
				],
				stream: false,
				temperature: this.config.temperature,
				provider: {
					sort: {
						by: "throughput",
					},
				},
				responseFormat: { type: "json_object" },
			})

			const rawContent = response.choices.at(0)?.message.content
			const content =
				typeof rawContent === "string"
					? rawContent
					: rawContent
							?.map((part) => ("text" in part ? part.text : ""))
							.join("")

			if (!content) {
				return {
					success: false as const,
					error: "Empty response from model",
				}
			}

			const data = schema.parse(parseJsonContent(content))

			return {
				success: true as const,
				data,
			}
		} catch (error) {
			console.error("Error OpenRouterService", error)

			return {
				success: false as const,
				error: error instanceof Error ? error.message : String(error),
			}
		}
	}
}
