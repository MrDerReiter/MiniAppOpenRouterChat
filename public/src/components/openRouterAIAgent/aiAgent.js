/**
 * Универсальный AI-агент для удобного обращения к популярным сервисам LLM. По умолчанию ориентирован на сервис OpenRouter.ai, но может также быть настроен на взаимодействие и с другими сервисами.
 * Предоставляет простой контракт взаимодействия с LLM, позволяя абстрагироваться от HTTP-запросов и JSON-обьектов с неочевидной структурой.
 */
export class AIAgent {
  get context() { return this._context }
  get modelID() { return this._router?.currentModelID; }
  set modelID(value) { this._router.currentModelID = value; }


  constructor(token, router) {
    this._token = token;
    this._router = router;
  }

  async getAIModels(predicate) {
    const httpRequest = {
      method: "GET",
      headers: { Authorization: `Bearer ${this._token}` }
    }

    return fetch(this._router.modelsListUrl, httpRequest)
      .then(response => {
        if (response.ok) return response.json();
        else throw new Error(`запрос отклонён с кодом ${response.status}`);
      }).then(responseBody => {
        const models = responseBody.data;
        if (predicate) return models.filter(predicate);
        else return models;
      }).catch((error) => Promise.reject(error));
  }

  async singleCompletion(prompt) {
    if (!this.modelID) throw new Error("Не был установлен ID модели перед отправкой запроса.");

    const httpRequest = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this._token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: this.modelID, prompt: prompt })
    }

    return fetch(this._router.singleCompletionUrl, httpRequest)
      .then(response => {
        if (response.ok) return response.json();
        else throw new Error(`Запрос отклонён с кодом ${response.status}.`)
      }).then(responseObject => responseObject.choices[0].text)
      .catch ((error) => Promise.reject(error));
  }

  async chatCompletion(prompt) {
    if (!this.modelID) throw new Error("Не был установлен ID модели перед отправкой запроса.");

    if (!this._context) this._context = [];
    this._context.push({ role: "user", content: prompt });

    const httpRequest = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this._token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: this.context, model: this.modelID })
    }

    return fetch(this._router.chatCompletionUrl, httpRequest)
      .then(response => {
        if (response.ok) return response.json();
        else throw new Error(`запрос отклонён с кодом ${response.status}`);
      }).then(responseObject => {
        const answer = responseObject.choices[0].message.content;
        this.context.push({ role: "assistant", content: answer });
        return answer;
      }).catch((error) => {
        this._context.pop();
        return Promise.reject(error);
      });
  }

  loadContext(context) { this._context = context }

  clearContext() { this._context = []; }
}