import { AIRouter } from "./aiRouter.js";


export type Message = {
	role: string;
	content: string;
}
export type AIModelInfo = {
	id: string,
	name: string,
	pricing: {
		prompt: string,
		completion: string
	}
}

/**
 * Универсальный AI-агент для удобного обращения к популярным сервисам LLM. По умолчанию ориентирован на сервис OpenRouter.ai, но может также быть настроен на взаимодействие и с другими сервисами.
 * Предоставляет простой контракт взаимодействия с LLM, позволяя абстрагироваться от HTTP-запросов и JSON-обьектов с неочевидной структурой.
 */
export class AIAgent {
	private readonly _token: string;
	private readonly _router: AIRouter;
	private _context: Array<Message>;

	public get context() { return this._context }
	public get modelID() { return this._router?.currentModelID; }
	public set modelID(value) { this._router.currentModelID = value; }


	public constructor(token: string, router: AIRouter) {
		this._token = token;
		this._router = router;
	}


	public async getAIModels(predicate?: (model: AIModelInfo) => boolean) {
		const httpRequest = {
			method: "GET",
			headers: { Authorization: `Bearer ${this._token}` }
		}

		return fetch(this._router.modelsListUrl, httpRequest)
			.then(response => {
				if (response.ok) return response.json();
				else throw new Error(`запрос отклонён с кодом ${response.status}`);
			}).then(responseObject => {
				const models = responseObject.data as Array<AIModelInfo>;
				if (predicate) return models.filter(predicate);
				else return models;
			}).catch((error: Error) => Promise.reject(error));
	}

	public async singleCompletion(prompt: string) {
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
			}).then(responseObject => responseObject.choices[0].text as string)
			.catch((error: Error) => Promise.reject(error));
	}

	public async chatCompletion(prompt: string) {
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
				const answer = responseObject.choices[0].message.content as string;
				this.context.push({ role: "assistant", content: answer });
				return answer;
			}).catch((error: Error) => {
				this._context.pop();
				return Promise.reject(error);
			});
	}

	public loadContext(context: Array<Message>) { this._context = context }
	
	public clearContext() { this._context = []; }
}