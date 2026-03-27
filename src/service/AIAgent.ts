interface ModelPredicate { (model: AIModelInfo): boolean; }
interface SingleResponse { choices: { text: string }[]; }
interface ChatResponse { choices: { message: { content: string } }[]; }
interface AIRequestOptions { url: string; token: string; }
interface SingleCompletionOptions extends AIRequestOptions { model: string; prompt: string; }
interface ChatCompletionOptions extends AIRequestOptions { model: string; messages: Message[]; }

export interface Message { role: "user" | "assistant" | "system", content: string }
export interface AIModelInfo {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  }
}


export async function getAIModels(options: AIRequestOptions, predicate?: ModelPredicate) {
  const { url, token } = options;

  return fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => {
    if (response.ok) return response.json();
    else throw new Error(`запрос отклонён с кодом ${response.status}`);
  }).then((body: { data: AIModelInfo[] }) => {
    const models = body.data;
    if (predicate) return models.filter(predicate);
    else return models;
  }).catch((error: Error) => Promise.reject(error));
}

export async function singleCompletion(options: SingleCompletionOptions) {
  const { url, token, model, prompt } = options;

  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model, prompt })
  }).then(response => {
    if (response.ok) return response.json();
    else throw new Error(`Запрос отклонён с кодом ${response.status}.`);
  }).then((body: SingleResponse) => {
    const answer = body?.choices?.[0].text;
    if (answer) return answer;
    else throw new Error("сервер прислал невалидный ответ");
  }).catch((error: Error) => Promise.reject(error));
}

export async function chatCompletion(options: ChatCompletionOptions) {
  const { url, token, model, messages } = options;

  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages, model })
  }).then(response => {
    if (response.ok) return response.json();
    else throw new Error(`запрос отклонён с кодом ${response.status}`);
  }).then((body: ChatResponse) => {
    const answer = body?.choices?.[0].message.content;
    if (answer) return answer;
    else throw new Error("сервер прислал невалидный ответ");
  }).catch((error: Error) => Promise.reject(error));
}


export const routers = {
  openRouter: {
    singleCompletionUrl: "https://openrouter.ai/api/v1/completions",
    chatCompletionUrl: "https://openrouter.ai/api/v1/chat/completions",
    modelsListUrl: "https://openrouter.ai/api/v1/models"
  }
}