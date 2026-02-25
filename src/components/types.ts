import type { ReactElement, ReactNode } from "react"


export namespace Props {
  export type Router = { children: ReactElement[]; }
  export type Page = { path: string; content: ReactElement; }
  export type Chat = { model: string; }
  export type ErrorMessage = { children: ReactNode; alertText: string }
  export type MessagesContainer = { context: Message[], error?: Error }

  export type ModelSelector = {
    dataSource: Promise<IAIModel[]>;
    onModelSelected: (modelID: string) => void;
  }

  export type PromptPanel = {
    onWaitingAnswer: (question: string) => Promise<void>;
    onClearContext: () => void;
  }
}