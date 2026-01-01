declare module "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js" {
  interface IMarkdownParser {
    parse(markdown: string): string;
  }

  export const marked: IMarkdownParser;
}