import ErrorMessage from "./ErrorMessage";
import type { CSSProperties } from "react";
import type { ChatMessages } from "@openrouter/sdk/models";


type MessagesContainerProps = {
  context: ChatMessages[];
  error?: Error;
  lastAnswerStreamText?: string;
};


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
  cursor: "default"
};


export default function MessagesContainer(props: MessagesContainerProps) {
  const { context, error, lastAnswerStreamText } = props;

  return (
    <div style={container}>
      {context.map((message, index) => {
        return (
          message.role == "user" ?
            <p className="text-box" style={question} key={index}>{message.content as string}</p> :
            <div key={index}
              className="answer"
              dangerouslySetInnerHTML={{ __html: message.content as string }} />
        );
      })}
      {lastAnswerStreamText &&
        <div className="answer"
          dangerouslySetInnerHTML={{ __html: lastAnswerStreamText }} />}
      {error &&
        <ErrorMessage alertText={error.message}>
          Попробуйте отправить новый запрос, или выберите другую модель.
        </ErrorMessage>}
    </div>
  );
}