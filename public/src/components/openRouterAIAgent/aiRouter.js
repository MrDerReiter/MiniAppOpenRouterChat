/**
 * Обьект, инкапсулирующий реквизиты для взаимодействия с сервером провайдера AI.
 * Требуется AI-агенту для корректной работы. Данный обьект не нужно создавать с
 * помощью конструктора; вместо этого используйте статические свойства класса
 * (только для чтения), которые возвращают подходящий объект для определённого сервиса.
 */
export class AIRouter {
	/** @type {String} */ currentModelID;
	/** @type {String} */ singleCompletionUrl;
	/** @type {String} */ chatCompletionUrl;
	/** @type {String} */ modelsListUrl;

	/** Роутер для сервиса www.openrouter.ai */
	static get openRouter() {
		const router = new AIRouter();
		router.singleCompletionUrl = "https://openrouter.ai/api/v1/completions";
		router.chatCompletionUrl = "https://openrouter.ai/api/v1/chat/completions";
		router.modelsListUrl = "https://openrouter.ai/api/v1/models";

		return router;
	}
}