/**
 * Универсальный AI-агент для удобного обращения к популярным сервисам LLM.
 * По умолчанию ориентирован на сервис OpenRouter.ai, но может также быть настроен
 * на взаимодействие и с другими сервисами.
 * Предоставляет простой контракт взаимодействия с LLM, позволяя абстрагироваться
 * от HTTP-запросов и JSON-обьектов с неочевидной структурой.
 */
export class AIAgent {
    #token;

    /**
     * Объект с настройками подключения к провайдеру LLM.
     * @returns {AIRouter}
    */
    router;
    /**
     * Сохранённые сообщения пользователя и LLM, в виде массива.
     * @returns {Object[]}
     */
    context = [];

    /**
     * Строка с ID текущей LLM-модели, к которой будет идти обращение.
     * @returns {string}
    */
    get modelID() { return this.router?.currentModelID; }
    set modelID(value) { this.router.currentModelID = value; }

    /**
     * @param {string} token Токен для идентификации запросов к провайдеру LLM.
     * @param {AIRouter} router Объект с настройками маршрутизации запросов.
     */
    constructor(token, router) {
        this.#token = token;
        this.router = router;
    }

    /**
     * Асинхронно запрашивает с сервера список доступных на данный момент моделей.
     * @param {function} predicate (Опционально) Функция-предикат, для создания выборки.
     * @returns {Promise<Object[]>} Промис, результатом которого будет массив с объектами,
     * каждый из которых хранит информацию о конкретной модели, к которой можно сделать запрос.
     * Если был передан предикат в качестве параметра, массив будет заранее отфильтрован.
     */
    async getAIModels(predicate = null) {
        const httpRequest = {
            method: "GET",
            headers: { Authorization: `Bearer ${this.#token}` }
        }

        return fetch(this.router.modelsListUrl, httpRequest)
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
     * @param {string} prompt Текст запроса к LLM.
     * @returns {Promise<string>} Промис, результатом которого будет строка с ответом от LLM.
     * Не учитывает контекст (ранее полученные и отправленные сообщения).
     * Каждый такой запрос модель будет интерпретировать как новый диалог.
     */
    async singleCompletion(prompt) {
        if (!this.modelID) throw new Error("ModelID не определён.");

        const httpRequest = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.#token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ model: this.modelID, prompt: prompt })
        }

        return fetch(this.router.singleCompletionUrl, httpRequest)
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
     * @param {string} prompt Текст запроса к AI.
     * @returns {Promise<string>} Промис, результатом которого будет строка с ответом от LLM.
     */
    async chatCompletion(prompt) {
        if (!this.modelID) throw new Error("ModelID не определён.");

        const httpRequest = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.#token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: this.context, model: this.modelID })
        }

        this.context.push({ role: "user", content: prompt });

        return fetch(this.router.chatCompletionUrl, httpRequest)
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error(`запрос отклонён с кодом ${response.status}`);
            }).then(body => {
                const answer = body.choices[0].message.content;
                this.context.push({ role: "assistant", content: answer });
                return answer;
            }).catch(error => {
                this.context.pop();
                return Promise.reject(error);
            });
    }

    /**
     * Очищает контекст, так что все последующие сообщения будут
     * интерпретироваться LLM как новый диалог.
     */
    clearContext() { this.context = []; }
}


/**
 * Обьект, инкапсулирующий реквизиты для взаимодействия с сервером провайдера AI.
 * Требуется AI-агенту для корректной работы. Данный обьект не нужно создавать с
 * помощью конструктора; вместо этого используйте статические свойства класса
 * (только для чтения), которые возвращают подходящий объект для определённого сервиса.
 */
export class AIRouter {
    currentModelID;
    singleCompletionUrl;
    chatCompletionUrl;
    modelsListUrl;

    /** Роутер для сервиса www.openrouter.ai */
    static get openRouter() {
        const router = new AIRouter();
        router.singleCompletionUrl = "https://openrouter.ai/api/v1/completions";
        router.chatCompletionUrl = "https://openrouter.ai/api/v1/chat/completions";
        router.modelsListUrl = "https://openrouter.ai/api/v1/models";

        return router;
    }
}