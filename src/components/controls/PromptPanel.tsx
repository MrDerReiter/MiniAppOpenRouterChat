import { useRef, useState } from "react";
import "../../../style/components/promptPanel.css";


type PromptPanelProps = {
  onWaitingAnswer: (question: string) => Promise<void>;
  onClearContext: () => void;
}

export default function PromptPanel(props: PromptPanelProps) {
  function sendRequest() {
    if (!prompt) { denyRequest(); return; }

    setIsBlocked(true);
    onWaitingAnswer(prompt)
      .then(() => {
        setPrompt("");
        localStorage.removeItem("lastPrompt");
      })
      .catch(() => localStorage.setItem("lastPrompt", prompt))
      .finally(() => setIsBlocked(false));
  }

  function clearContext() {
    localStorage.clear();
    onClearContext();
    setPrompt("");
  }

  function denyRequest() {
    const box = promptBox.current;

    box.style.borderColor = "red";
    box.placeholder = "Вы не ввели запрос!";
    box.onfocus = () => {
      box.style.borderColor = "";
      box.placeholder = "";
      box.onfocus = null;
    }
  }


  const { onWaitingAnswer, onClearContext } = props;
  const promptBox = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState(() => localStorage.getItem("lastPrompt") ?? "");
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <form>
      <textarea
        ref={promptBox}
        value={prompt}
        readOnly={isBlocked}
        name="prompt-panel"
        className="prompt-box"
        onChange={(event) => setPrompt(event.target.value)} />
      <button
        type="button"
        disabled={isBlocked}
        className="submit-button"
        onClick={sendRequest}>Отправить</button>
      <button
        type="button"
        disabled={isBlocked}
        className="submit-button"
        onClick={clearContext}>Очистить контекст</button>
    </form>
  );
}