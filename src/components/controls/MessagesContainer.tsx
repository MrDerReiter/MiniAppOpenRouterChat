import { marked as markupParser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import type { Props } from "../types";
import ErrorMessage from "./ErrorMessage";
import "../../../style/components/messagesContainer.css";


export default function MessagesContainer(props: Props.MessagesContainer) {
  const { context, error } = props;

  return (
    <div className="messages-container">{
      context.map((message, index) => {
        return (
          message.role == "user" ?
            <p className="text-box question" key={index}>{message.content}</p> :
            <div className="answer" key={index}
              dangerouslySetInnerHTML={{ __html: markupParser.parse(message.content) }} />
        );
      })}{error &&
        <ErrorMessage alertText={error.message}>
          Попробуйте отправить новый запрос, или выберите другую модель.
        </ErrorMessage>
      }</div>
  );
}