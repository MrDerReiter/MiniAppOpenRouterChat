import type { Props } from "../types";



export default function ErrorMessage(props: Props.ErrorMessage) {
  const { children, alertText } = props;

  return (
    <p className="text-box">
      Что-то пошло не так: <span className="alert-text">{alertText}</span><br />
      {children}
    </p>
  );
}