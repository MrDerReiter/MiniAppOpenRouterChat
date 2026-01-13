declare type Message = {
  role: string;
  content: string;
}

declare type RequestOptions = {
  url: string;
  token: string;
  modelID?: string;
}

declare type AIModelInfo = {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
}