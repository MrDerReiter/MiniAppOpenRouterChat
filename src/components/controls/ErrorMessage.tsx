import type { ReactNode } from "react";

type ErrorMessageProps = { children: ReactNode; alertText: string }

export default function ErrorMessage(props: ErrorMessageProps) {
  const { children, alertText } = props;

  return (
    <p className="text-box">
      Что-то пошло не так: <span className="alert-text">{alertText}</span><br />
      {children}
    </p>
  );
}