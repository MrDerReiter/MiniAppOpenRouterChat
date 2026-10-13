import { useCallback, useMemo, useState } from "react";
import { listFreeModels } from "./openRouterAgent";
import Router from "./components/Router";
import Page from "./components/Page";
import ModelSelector from "./components/pages/ModelSelector";
import Chat from "./components/pages/Chat";

import "../style/bootstrap.min.css";
import "../style/app.css";
import "../style/panels.css";
import "../style/buttons.css";


export default function App() {
  const navigateToChat = useCallback((model: string) => {
    setModel(model);
    window.history.pushState({}, "", "/chat");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);
  const models = useMemo(() => listFreeModels(), []);
  const [modelID, setModel] = useState<string>();

  return (
    <Router>
      <Page path="/" content={
        <ModelSelector
          dataSource={models}
          onModelSelected={navigateToChat} />
      } />
      <Page path="/chat" content={<Chat model={modelID} />} />
    </Router>
  );
}
