declare module "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js" {
  interface IMarkupParser { parse: (markupText: string) => string }
  export const marked: IMarkupParser;
}