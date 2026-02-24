import { marked as markupParser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import ErrorMessage from "./ErrorMessage";
import "../../../style/components/messagesContainer.css";

type MessagesContainerProps = { context: Message[], error?: Error }

export default function MessagesContainer(props: MessagesContainerProps) {
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