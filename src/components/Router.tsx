import { useEffect, useState } from "react";
import type { Props } from "./types";


export default function Router(props: Props.Router) {
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