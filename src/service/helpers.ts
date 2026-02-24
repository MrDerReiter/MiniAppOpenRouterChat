import token from "../token";
import { openRouter } from "./openRouterAIAgent/routers";
import { chatCompletion } from "./openRouterAIAgent/agent";


export async function makeRequestToAI(model: string, prompt: string, context: Message[]) {
  const promptMessage: Message = { role: "user", content: prompt };

  try {
    const answer = await chatCompletion({
      url: openRouter.chatCompletionUrl,
      messages: [...context, promptMessage],
      model,
      token
    });
    const answerMessage: Message = { role: "assistant", content: answer };
    return [...context, promptMessage, answerMessage];
  } catch (error) { return Promise.reject(error); }
}

export function isFreeModel(model: IAIModel) {
  return model.pricing.prompt == "0" &&
    model.pricing.completion == "0"
}