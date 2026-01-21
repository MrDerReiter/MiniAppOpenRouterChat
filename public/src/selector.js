import { token } from "./token.js";
import { getAIModels } from "./components/openRouterAIAgent/agent.js";
import { openRouter } from "./components/openRouterAIAgent/routers.js";
import { isFreeModel } from "./components/helpers.js";
import * as page from "./UI/selectorPage.js";


page.init(() => getAIModels({ url: openRouter.modelsListUrl, token }, isFreeModel));