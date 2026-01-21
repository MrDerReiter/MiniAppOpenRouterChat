import { token } from "./token.js";
import { chatCompletion } from "./components/openRouterAIAgent/agent.js";
import { openRouter } from "./components/openRouterAIAgent/routers.js";
import * as page from "./UI/chatPage.js";


function makeRequestToAI(prompt, context = null) {
  const promptMessage = { role: "user", content: prompt };
  const actualContext = context ? [...context, promptMessage] : [promptMessage];
  return chatCompletion(actualContext, requestOptions);
}


const params = new URLSearchParams(location.search);
const requestOptions = {
  url: openRouter.chatCompletionUrl,
  modelID: params.get("model"),
  token
};

page.init(makeRequestToAI);