import { useState, type CSSProperties, type MouseEvent } from "react";
import { streamAnswer } from "../../openRouterAgent";
import { marked } from "marked";
import Spinner from "../controls/Spinner";
import PromptPanel from "../controls/PromptPanel";
import MessagesContainer from "../controls/MessagesContainer";
import type { ChatAssistantMessage, ChatMessages, ChatUserMessage } from "@openrouter/sdk/models";


const anchor: CSSProperties = {
  position: "fixed",
  width: 45,
  height: 45,
  fontSize: 30,
  color: "#aaa"
}


export default function Chat(props: { model: string; }) {
  async function performRequest(prompt: string) {
    setIsWaitingAnswer(true);
    if (error) setError(null);

    try {
      let buffer = "";
      const promptMessage: ChatUserMessage = { role: "user", content: prompt }
      const answerStream = streamAnswer(model, [...context, promptMessage]);
      for await (const chunk of answerStream) {
        buffer += chunk;
        setAnswerText(marked.parse(buffer));
      }

      const answerMessage: ChatAssistantMessage = {
        role: "assistant",
        content: marked.parse(buffer) as string
      };
      const updateContext: ChatMessages[] = [
        ...context,
        promptMessage,
        answerMessage
      ];

      setAnswerText(null);
      setContext(updateContext);
      localStorage.setItem("context", JSON.stringify(updateContext));
    } catch (error) { setError(error); throw error; }
    finally { setIsWaitingAnswer(false); }
  }

  function navigateToModelSelector(event: MouseEvent) {
    event.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function loadContext(): ChatMessages[] {
    const savedContext = localStorage.getItem("context");
    return savedContext ? JSON.parse(savedContext) as ChatMessages[] : [];
  }

  function dropContext() {
    if (error) setError(null);
    setContext([]);
  }


  const { model } = props;
  const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
  const [answerText, setAnswerText] = useState(null);
  const [context, setContext] = useState(loadContext);
  const [error, setError] = useState<Error>();

  return (
    <>
      <h2 id="top">Напишите ваш запрос к LLM:</h2>
      <PromptPanel
        onWaitingAnswer={performRequest}
        onClearContext={dropContext} />
      {isWaitingAnswer && <Spinner />}
      <MessagesContainer
        lastAnswerStreamText={answerText}
        context={context}
        error={error} />
      <a id="bottom" onClick={navigateToModelSelector}>← Назад к выбору модели</a>
      <a style={{ ...anchor, top: 100, right: "0.5rem" }} href="#top">↑</a>
      <a style={{ ...anchor, bottom: 50, right: "0.5rem" }} href="#bottom">↓</a>
    </>
  );
}