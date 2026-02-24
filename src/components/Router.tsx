import { useEffect, useState, type ReactElement } from "react";


type RouterProps = { children: ReactElement[]; }

export default function Router(props: RouterProps) {
  const { children } = props;
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() =>
    window.onpopstate = () =>
      setPath(window.location.pathname), []
  );

  return <>{
    children.find(page => page.props["path"] == path) ??
    <h1>Страница не найдена</h1>
  }</>;
}