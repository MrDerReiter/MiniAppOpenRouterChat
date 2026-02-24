import type { ReactElement } from "react";


type PageProps = { path: string; content: ReactElement; }

export default function Page(props: PageProps) { return props.content; }