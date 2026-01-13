declare module "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js" {
  interface IMarkupParser {
    parse(markup: string): string;
  }

  export const marked: IMarkupParser;
}