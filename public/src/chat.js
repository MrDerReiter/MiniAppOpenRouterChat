import { token } from "./token.js";
import { chatCompletion } from "./components/openRouterAIAgent/agent.js";
import { openRouter } from "./components/openRouterAIAgent/routers.js";
import * as page from "./UI/chatPage.js";


function makeRequestToAI(prompt, context) {
  const promptMessage = { role: "user", content: prompt };
  const actualContext = context ? [...context, promptMessage] : [promptMessage];

  return chatCompletion({
    messages: actualContext,
    model: new URLSearchParams(location.search).get("model"),
    url: openRouter.chatCompletionUrl,
    token
  });
}

page.init(makeRequestToAI);