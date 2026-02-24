declare module "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js" {
  interface IMarkupParser { parse: (markupText: string) => string }
  export const marked: IMarkupParser;
}

declare interface IAIModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  }
}

declare interface IModelPredicate { (model: IAIModel): boolean; }
declare interface ISingleResponse { choices: { text: string }[]; }
declare interface IChatResponse { choices: { message: { content: string } }[]; }

declare type Message = { role: "user" | "assistant", content: string }
declare type AIRequestOptions = { url: string; token: string; }
declare type SingleCompletionOptions = AIRequestOptions & {
  model: string;
  prompt: string;
}
declare type ChatCompletionOptions = AIRequestOptions & {
  model: string;
  messages: Message[];
}