import { useState, type MouseEvent } from "react";
import { makeRequestToAI } from "../../service/helpers";
import type { Props } from "../types";
import Spinner from "../controls/Spinner";
import PromptPanel from "../controls/PromptPanel";
import MessagesContainer from "../controls/MessagesContainer";
import "../../../style/chat.css";


export default function Chat(props: Props.Chat) {
  function performRequest(prompt: string) {
    setIsWaitingAnswer(true);

    return makeRequestToAI(model, prompt, context)
      .then(context => {
        if (error) setError(null);
        setContext(context);
        localStorage.setItem("context", JSON.stringify(context));
      }).catch(error => {
        setError(error);
        return Promise.reject()
      }).finally(() => setIsWaitingAnswer(false));
  }

  function navigateToModelSelector(event: MouseEvent) {
    event.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function loadContext() {
    const savedContext = localStorage.getItem("context");
    return savedContext ? JSON.parse(savedContext) as Message[] : [];
  }

  function dropContext() {
    if (error) setError(null);
    setContext([]);
  }


  const { model } = props;
  const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
  const [context, setContext] = useState(loadContext);
  const [error, setError] = useState<Error>();

  return (
    <>
      <h2 id="top">Напишите ваш запрос к LLM:</h2>
      <PromptPanel
        onWaitingAnswer={performRequest}
        onClearContext={dropContext} />
      {isWaitingAnswer && <Spinner />}
      <MessagesContainer {...{ context, error }} />
      <a id="bottom" className="ref"
        onClick={navigateToModelSelector}>← Назад к выбору модели</a>
      <a className="ref page-anchor scroll-top" href="#top">↑</a>
      <a className="ref page-anchor scroll-bottom" href="#bottom">↓</a>
    </>
  );
}