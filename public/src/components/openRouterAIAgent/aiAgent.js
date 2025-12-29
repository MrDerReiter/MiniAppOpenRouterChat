/**
 * Универсальный AI-агент для удобного обращения к популярным сервисам LLM.
 * По умолчанию ориентирован на сервис OpenRouter.ai, но может также быть настроен
 * на взаимодействие и с другими сервисами.
 * Предоставляет простой контракт взаимодействия с LLM, позволяя абстрагироваться
 * от HTTP-запросов и JSON-обьектов с неочевидной структурой.
 */
export class AIAgent {
	/** @private @type {String} */ _token;
	/** @private @type {AIRouter} */ _router;
	/** @private @type {Array} */ _context = [];

	/**
	 * Сохранённые сообщения пользователя и LLM, в виде массива (только для чтения).
	 * @readonly
	 * @type {Array}
	 */
	get context() { return this._context }

	/**
	 * Возвращает или задаёт строку с ID текущей LLM-модели,
	 * к которой будет идти обращение.
	 * @type {String | undefined}
	*/
	get modelID() { return this._router?.currentModelID; }
	set modelID(value) { this._router.currentModelID = value; }


	/**
	 * @param {String} token Токен для идентификации запросов к провайдеру LLM.
	 * @param {AIRouter} router Объект с настройками маршрутизации запросов.
	 */
	constructor(token, router) {
		this._token = token;
		this._router = router;
	}


	/**
	 * Асинхронно запрашивает с сервера список доступных на данный момент моделей.
	 * @param {(model: Object) => Boolean} predicate
	 * (Опционально) Функция-предикат, для создания выборки.
	 * @returns {Promise<Array>}
	 * Промис, результатом которого будет массив с объектами,
	 * каждый из которых хранит информацию о конкретной модели, к которой можно сделать запрос.
	 * Если был передан предикат в качестве параметра, массив будет заранее отфильтрован.
	 */
	async getAIModels(predicate = null) {
		const httpRequest = {
			method: "GET",
			headers: { Authorization: `Bearer ${this._token}` }
		}

		return fetch(this._router.modelsListUrl, httpRequest)
			.then(response => {
				if (response.ok) return response.json()
				else throw new Error(`запрос отклонён с кодом ${response.status}`);
			}).then(body => {
				const models = body.data;
				if (predicate) return models.filter(predicate);
				else return models;
			}).catch(error => Promise.reject(error));
	}
	/**
	 * Асинхронно отправляет одиночный(!) запрос к ранее выбранной LLM.
	 * @param {String} prompt Текст запроса к LLM.
	 * @returns {Promise<String>} Промис, результатом которого будет строка с ответом от LLM.
	 * Не учитывает контекст (ранее полученные и отправленные сообщения).
	 * Каждый такой запрос модель будет интерпретировать как новый диалог.
	 */
	async singleCompletion(prompt) {
		if (!this.modelID) throw new Error("ModelID не определён.");

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
			})
			.then(body => body.choices[0].text)
			.catch(error => Promise.reject(error));
	}
	/**
	 * Асинхронно запрашивает ответ в чате от AI. Отправляет модели контекст, чтобы она могла учитывать
	 * при ответе ранее отправленные и полученные сообщения (если только контекст
	 * перед этим не был очищен). Также запоминает промпт клиента и ответ AI для
	 * контекста последующих запросов.
	 * @param {String} prompt Текст запроса к AI.
	 * @returns {Promise<String>} Промис, результатом которого будет строка с ответом от LLM.
	 */
	async chatCompletion(prompt) {
		if (!this.modelID) throw new Error("ModelID не определён.");

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
			}).then(body => {
				const answer = body.choices[0].message.content;
				this.context.push({ role: "assistant", content: answer });
				return answer;
			}).catch(error => {
				this._context.pop();
				return Promise.reject(error);
			});
	}
	/**
	 * Загружает новый контекст; можно использовать, например, для возобновления предыдущей сессии.
	 * @param {Array} context
	 */
	loadContext(context) { this._context = context }
	/**
	 * Очищает контекст, так что все последующие сообщения будут
	 * интерпретироваться LLM как новый диалог.
	 */
	clearContext() { this._context = []; }
}