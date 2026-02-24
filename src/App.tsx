import { useCallback, useMemo, useState } from "react";
import { getAIModels } from "./service/openRouterAIAgent/agent";
import { openRouter } from "./service/openRouterAIAgent/routers";
import Router from "./components/Router";
import Page from "./components/Page";
import ModelSelector from "./components/pages/ModelSelector";
import Chat from "./components/pages/Chat";
import token from "./token"
import "../style/bootstrap.min.css";
import "../style/main.css";


export default function App() {
  const navigateToChat = useCallback((model: string) => {
    setModel(model);
    window.history.pushState({}, "", "/chat");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const models = useMemo(() => getAIModels({ url: openRouter.modelsListUrl, token }), []);
  const [model, setModel] = useState<string>();

  return (
    <Router>
      <Page path="/" content={
        <ModelSelector
          dataSource={models}
          onModelSelected={navigateToChat} />
      } />
      <Page path="/chat" content={<Chat model={model} />} />
    </Router>
  );
}
