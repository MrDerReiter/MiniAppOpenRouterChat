export async function getAIModels(options: AIRequestOptions, predicate?: IModelPredicate) {
  const { url, token } = options;

  return fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => {
    if (response.ok) return response.json();
    else throw new Error(`запрос отклонён с кодом ${response.status}`);
  }).then((body: { data: IAIModel[] }) => {
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
  }).then((body: ISingleResponse) => {
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
  }).then((body: IChatResponse) => {
    const answer = body?.choices?.[0].message.content;
    if (answer) return answer;
    else throw new Error("сервер прислал невалидный ответ");
  }).catch((error: Error) => Promise.reject(error));
}