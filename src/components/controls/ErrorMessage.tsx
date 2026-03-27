import type { ReactNode } from "react";


export type ErrorMessageProps = { children: ReactNode; alertText: string }

export default function ErrorMessage(props: ErrorMessageProps) {
  const { children, alertText } = props;

  return (
    <p className="text-box">
      Что-то пошло не так: <span style={{ color: "red" }}>{alertText}</span><br />
      {children}
    </p>
  );
}