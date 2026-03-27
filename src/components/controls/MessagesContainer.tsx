import { marked as markupParser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import type { CSSProperties } from "react";
import type { Message } from "../../service/AIAgent";
import ErrorMessage from "./ErrorMessage";


type MessagesContainerProps = { context: Message[], error?: Error };

const container: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignSelf: "start",
  alignItems: "start",
  margin: "50px 10px 15px 10px",
  maxWidth: "90%",
  padding: 15
};

const question: CSSProperties = {
  background: "linear-gradient(135deg, #121959, #172179)",
  userSelect: "none"
}


export default function MessagesContainer(props: MessagesContainerProps) {
  const { context, error } = props;

  return (
    <div style={container}>
      {context.map((message, index) => {
        return (
          message.role == "user" ?
            <p className="text-box" style={question} key={index}>{message.content}</p> :
            <div className="answer" key={index}
              dangerouslySetInnerHTML={{ __html: markupParser.parse(message.content) }} />
        );
      })}
      {error &&
        <ErrorMessage alertText={error.message}>
          Попробуйте отправить новый запрос, или выберите другую модель.
        </ErrorMessage>}
    </div>
  );
}