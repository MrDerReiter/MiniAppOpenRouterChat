import token from "./token";
import { OpenRouter } from "@openrouter/sdk";
import type { ChatMessages, ChatStreamChunk, Model } from "@openrouter/sdk/models";
import type { EventStream } from "@openrouter/sdk/lib/event-streams.js";

const agent = new OpenRouter({ apiKey: token });

export async function listFreeModels(): Promise<Model[]> {
  let result: Model[] = [];
  const fullList = await agent.models.list();
  for await (const page of fullList)
    result.push(...page.result.data);

  return result.filter(model =>
    model.pricing.prompt == "0" &&
    model.pricing.completion == "0");
}

export async function* streamAnswer(model: string, context: ChatMessages[]): AsyncGenerator<string> {
  const stream = await agent.chat.send({
    chatRequest: {
      model,
      stream: true,
      messages: context
    }
  }) as EventStream<ChatStreamChunk>;

  for await (const chunk of stream)
    yield chunk.choices[0].delta?.content ?? ""
}