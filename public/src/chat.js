import { token } from "./token.js";
import { chatCompletion } from "./components/openRouterAIAgent/agent.js";
import { openRouter } from "./components/openRouterAIAgent/routers.js";
import * as page from "./UI/chatPage.js";


/**
 * @param {string} prompt
 * @param {{role: string, content: string}[]} context
 */
async function makeRequestToAI(prompt, context = null) {
  prompt = { role: "user", content: prompt };
  context = context ? [...context, prompt] : [prompt];
  const answer = await chatCompletion(context, requestOptions);

  return answer;
}


const urlParams = new URLSearchParams(location.search);
const requestOptions = {
  url: openRouter.chatCompletionUrl,
  modelID: urlParams.get("model"),
  token
};

page.init(makeRequestToAI);